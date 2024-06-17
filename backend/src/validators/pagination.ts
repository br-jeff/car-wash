import { Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationValidator {
  @Expose()
  @Transform(({ value }) => parseInt(value) ?? 1)
  @IsInt()
  @Min(1)
  @IsNumber()
  page: number;

  @Expose()
  @Transform(({ value }) => parseInt(value) ?? 10)
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  size: number;
}
