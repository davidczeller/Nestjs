import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from './../common/pagination.params';
import { PaginationResponse } from './../common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public async findAll(
    @Query() filters: FindTaskParams,
    @Query() pagination: PaginationParams,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);
    return {
      data: items,
      meta: {
        totalItems: total,
        limit: pagination.limit ?? 10,
        offset: pagination.offset ?? 0,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  // @Patch('/:id/status')
  // public async updateTaskStatus(
  //   @Param() params: FindOneParams,
  //   @Body() body: UpdateTaskStatusDto,
  // ): ITask {
  //   console.log('updateTaskStatus');
  //   const task = this.findOneOrFail(params.id);
  //   try {
  //     return this.tasksService.updateTask(task, { status: body.status });
  //   } catch (error) {
  //     if (error instanceof WrongTaskStatusException) {
  //       throw new BadRequestException([error.message]);
  //     }
  //     throw error;
  //   }
  // }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    console.log('updateTask');
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() { id }: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(id);
    await this.tasksService.removeLabels(task, labelNames);
  }

  // 1) Create an endpoint POST :id/labels
  // 2) addLabels - mixing existing labels with the new ones
  // 3) 500 - we need a method to get unique labels to store
  @Post('/:id/labels')
  async addLabels(
    @Param() { id }: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (task) {
      return task;
    }
    throw new NotFoundException();
  }
}

// @Get('/:id')
// // @Get('/:id?') could be used to make the id optional.
// // In this case, we would need to place this request to the file,
// // so it won't stop other requests from being processed.
// public findOne(@Param() params: FindOneParams): ITask {
//   const task = this.tasksService.findOne(params.id);
//   if (task) {
//     return task;
//   }
//   throw new NotFoundException();
// }
