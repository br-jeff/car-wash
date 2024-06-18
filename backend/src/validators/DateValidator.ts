import { IsNotEmpty, IsDateString } from 'class-validator';

export class DateValidator {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
