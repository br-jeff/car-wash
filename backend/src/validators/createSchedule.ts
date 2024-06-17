import { IsNotEmpty, IsString, Matches, IsIn } from 'class-validator';
import WashTypeEnum from 'src/enums/washType.enum';

export class CreateScheduleValidator {
  @IsNotEmpty()
  @IsString()
  @Matches(/[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/)
  licensePlate: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(WashTypeEnum))
  washType: 'SIMPLE' | 'FULL';

  @IsNotEmpty()
  @IsString()
  startDate: Date;
}

