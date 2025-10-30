import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  // Max shouldn't be here, since we never know how many items we will have
  @Max(10000)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // page?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // pageSize?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // pageCount?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // total?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // totalPages?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(10000)
  // currentPage?: number;
}
