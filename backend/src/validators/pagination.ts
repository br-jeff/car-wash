import { Expose, Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationValidator {
  @Expose()
  @Transform(({ value }) => value ?? 1)
  @IsNumber()
  @Min(1)
  page: number;

  @Expose()
  @Transform(({ value }) => value ?? 10)
  @Min(1)
  @IsNumber()
  size: number;
}
