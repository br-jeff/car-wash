import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ScheduleRepository } from 'src/repository/Schedule.repository';
import { CreateScheduleUseCase } from 'src/use-case/create-schedule-use-case';
import { ListAvalibleScheduleUseCase } from 'src/use-case/list-avalible-schedule-use-case';
import { CreateScheduleValidator } from 'src/validators/createSchedule';
import { PaginationValidator } from 'src/validators/pagination';

@Controller('schedule')
@Injectable()
export class ScheduleController {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private createScheduleUseCase: CreateScheduleUseCase,
    private listAvalibleScheduleUseCas: ListAvalibleScheduleUseCase,
  ) {}

  @Get()
  async findAll(@Query() queryParams: PaginationValidator) {
    const { page, size } = queryParams;
    console.log({ page, size });

    return this.scheduleRepository.listAll({
      pagination: {
        skip: (page - 1) * size,
        take: size,
      },
      filters: null,
    });
  }

  @Get('avalible-date')
  async findByDate(@Query() queryParams: PaginationValidator) {
    return this.listAvalibleScheduleUseCas.execute(data);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  )
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() data: CreateScheduleValidator) {
    return this.createScheduleUseCase.execute(data);
  }
}
