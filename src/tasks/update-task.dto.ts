// import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { PartialType } from '@nestjs/mapped-types';

// export class UpdateTaskDto {
//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsNotEmpty()
//   @IsEnum(TaskStatus)
//   status?: TaskStatus;
// }
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
