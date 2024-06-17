import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ScheduleRepository } from 'src/repository/Schedule.repository';
import { CreateScheduleUseCase } from 'src/use-case/create-schedule-use-case';
import { CreateScheduleValidator } from 'src/validators/createSchedule';
import { PaginationValidator } from 'src/validators/pagination';

@Controller('schedule')
@Injectable()
export class ScheduleController {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private createScheduleUseCase: CreateScheduleUseCase,
  ) {}

  @Get()
  async findAll(@Query() queryParams: PaginationValidator) {
    const { page, size } = queryParams;
    console.log({ page, size });

    return this.scheduleRepository.listAll({
      pagination: {
        skip: (Number(page) - 1) * Number(size),
        take: Number(size),
      },
      filters: null,
    });
  }

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() data: CreateScheduleValidator) {
    return this.createScheduleUseCase.execute(data);
  }
}
