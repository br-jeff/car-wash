import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import moment from 'moment';
import WashTypeEnum from 'src/enums/washType.enum';
import { ScheduleRepository } from 'src/repository/Schedule.repository';
import { CreateScheduleUseCase } from 'src/use-case/create-schedule-use-case';
import { CreateScheduleValidator } from 'src/validators/createSchedule';
import { PaginationValidator } from 'src/validators/pagination';


@Controller('schedule')
@Injectable()
export class ScheduleController {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private createScheduleUseCase: CreateScheduleUseCase
  ) { }

  @Get()
  async findAll(@Query() queryParams: PaginationValidator) {
    const { page, size } = queryParams
    return this.scheduleRepository.listAll({ pagination: { skip: size, take: page }, filters: null });
  }

  @Post()
  async create(@Body() data: CreateScheduleValidator) {

  }
}
