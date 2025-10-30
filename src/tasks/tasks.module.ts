import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskLabel } from './task-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskLabel])], // This is necessary to inject the repository into the service
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
