import { Injectable, BadRequestException } from '@nestjs/common';
import * as moment from 'moment'; // Error if use default export
import washingTypeEnum from 'src/enums/washType.enum';

import { ScheduleModelType } from 'src/model/Schedule.model';
import { ScheduleRepository } from 'src/repository/Schedule.repository';

@Injectable()
export class CreateScheduleUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute(data: Omit<ScheduleModelType, 'endDate'>) {
    console.info({ data });
    const endDate = moment(data.startDate);
    const startDate = moment(data.startDate);
    // this.validateInterval(startDate, endDate);

    if (data.washingType === washingTypeEnum.FULL) {
      endDate.add({ minutes: 45 });
    } else if (data.washingType === washingTypeEnum.SIMPLE) {
      endDate.add({ minutes: 30 });
    }

    const hasOverlap = await this.scheduleRepository.checkOverlapDate({
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });

    if (hasOverlap) {
      throw new BadRequestException('Já existe uma agenda nesse período');
    }

    return this.scheduleRepository.create({
      ...data,
      endDate: endDate.toDate(),
    });
  }

  private validateInterval(startDate: moment.Moment, endDate: moment.Moment) {
    const DAYS_OF_WEEK = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 0,
    };

    const BUSINESS_HOURS_CONSTANTS = {
      START_MORNING: 10,
      END_MORNING: 12,
      START_AFTERNOON: 13,
      END_AFTERNOON: 18,
      END_WORKDAY: 18,
    };

    const startDayOfWeek = startDate.day();
    const startHourOfDay = startDate.hour();
    const endHourOfDay = endDate.hour();

    // Verificar se o dia não é um dia da semana
    if (
      startDayOfWeek !== DAYS_OF_WEEK.MONDAY &&
      startDayOfWeek !== DAYS_OF_WEEK.TUESDAY &&
      startDayOfWeek !== DAYS_OF_WEEK.WEDNESDAY &&
      startDayOfWeek !== DAYS_OF_WEEK.THURSDAY &&
      startDayOfWeek !== DAYS_OF_WEEK.FRIDAY
    ) {
      throw new BadRequestException(
        'O agendamento deve ser feito de segunda a sexta-feira',
      );
    }

    if (
      startHourOfDay < BUSINESS_HOURS_CONSTANTS.START_MORNING ||
      startHourOfDay >= BUSINESS_HOURS_CONSTANTS.END_AFTERNOON ||
      (startHourOfDay >= BUSINESS_HOURS_CONSTANTS.END_MORNING &&
        startHourOfDay < BUSINESS_HOURS_CONSTANTS.START_AFTERNOON)
    ) {
      throw new BadRequestException(
        'O agendamento deve ser dentro do horário comercial (das 10h às 12h e das 13h às 18h)',
      );
    }

    if (endHourOfDay > BUSINESS_HOURS_CONSTANTS.END_WORKDAY) {
      throw new BadRequestException(
        'O agendamento não pode ultrapassar às 18h',
      );
    }
  }
}
function UseFilters(arg0: any): (target: typeof CreateScheduleUseCase) => void | typeof CreateScheduleUseCase {
  throw new Error('Function not implemented.');
}

