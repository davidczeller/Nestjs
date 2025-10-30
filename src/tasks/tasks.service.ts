import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from './../common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams,
  ): Promise<[Task[], number]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        {
          search: `%${filters.search}%`,
        },
      );
    }

    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...names)', {
          names: filters.labels,
        })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);
      // This will give back all the tasks that match the filters,
      // BUT it won't show all the labels on the task, so it's not the best way to do it
      // query.andWhere('labels.name IN (:...names)', {
      //   names: filters.labels,
      // });
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    query.skip(pagination.offset).take(pagination.limit);
    // console.log(query.getSql());
    return await query.getManyAndCount();
  }

  public async findOne(id: string): Promise<Task | null> {
    // // This is the correct way to do it, because it will not load the labels, so there is no performance issue
    // return await this.tasksRepository.findOneBy({ id });
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // const task = await this.tasksRepository.create({
    //   ...createTaskDto,
    //   labels: createTaskDto.labels.map((label) => ({
    //     name: label.name,
    //   })),
    // });
    // THE ABOVE CODE IS HANDLED BY THE TYPEORM HOOKS
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.tasksRepository.save(createTaskDto);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  public async addLabels(
    task: Task,
    labelDTOs: CreateTaskLabelDto[],
  ): Promise<Task> {
    // 1) Duplicate DTOs
    // 2) Get existing names
    // 3) New labels aren't already existing ones
    // 4) Save the ones that are really new
    const existingNames = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelDTOs)
      .filter((dto) => !existingNames.has(dto.name))
      .map((label) => this.labelsRepository.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.tasksRepository.save(task);
    }

    return task;
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }
  public async deleteTask(task: Task): Promise<void> {
    // await this.tasksRepository.remove(task);
    await this.tasksRepository.delete(task.id);
  }

  public async removeLabels(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    // 1) Remove existing labels from labels array
    // 2) Ways to solve:
    //     a) Remove labels from task=>labels and save() the Task
    //     b) Query Builder - SQL that deletes labels
    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );
    return await this.tasksRepository.save(task);
  }

  private getUniqueLabels(
    labelDTOs: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDTOs.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
  }
}
