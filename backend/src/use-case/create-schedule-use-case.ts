import { Injectable, BadRequestException } from '@nestjs/common';
import * as moment from 'moment'; // Error if use default export
import washingTypeEnum from 'src/enums/washType.enum';

import { ScheduleModelType } from 'src/model/Schedule.model';
import { ScheduleRepository } from 'src/repository/Schedule.repository';

@Injectable()
export class CreateScheduleUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute(data: Omit<ScheduleModelType, 'endDate'>) {
    const endDate = moment(data.startDate).add({ hour: -3 });
    const startDate = moment(data.startDate).add({ hour: -3 });

    if (data.washingType === washingTypeEnum.FULL) {
      endDate.add({ minutes: 45 });
    } else if (data.washingType === washingTypeEnum.SIMPLE) {
      endDate.add({ minutes: 30 });
    }

    this.validateInterval(startDate, endDate);
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
    if (!startDate.isAfter(moment())) {
      throw new BadRequestException('Agendamento no passado não é possivel');
    }
    const DAYS_OF_WEEK = {
      MONDAY: 3,
      TUESDAY: 4,
      WEDNESDAY: 5,
      THURSDAY: 6,
      FRIDAY: 0,
      SATURDAY: 1,
      SUNDAY: 2,
    };

    const BUSINESS_HOURS_CONSTANTS = {
      START_WORKING: 10,
      START_LUNCH: 12,
      END_LUNCH: 13,
      END_WORKING: 18,
    };

    const scheduleDay = startDate.weekday();
    const startHourOfSchedule = startDate.hour();
    const endHourOfSchedule = endDate.hour();

    console.log({ startDate, endDate, startHourOfSchedule });
    console.log({ scheduleDay, startHourOfSchedule, endHourOfSchedule });
    if (
      scheduleDay !== DAYS_OF_WEEK.MONDAY &&
      scheduleDay !== DAYS_OF_WEEK.TUESDAY &&
      scheduleDay !== DAYS_OF_WEEK.WEDNESDAY &&
      scheduleDay !== DAYS_OF_WEEK.THURSDAY &&
      scheduleDay !== DAYS_OF_WEEK.FRIDAY
    ) {
      throw new BadRequestException(
        'O agendamento deve ser feito de segunda a sexta-feira',
      );
    }

    if (
      startHourOfSchedule < BUSINESS_HOURS_CONSTANTS.START_WORKING ||
      startHourOfSchedule >= BUSINESS_HOURS_CONSTANTS.END_WORKING ||
      (startHourOfSchedule >= BUSINESS_HOURS_CONSTANTS.START_LUNCH &&
        startHourOfSchedule < BUSINESS_HOURS_CONSTANTS.END_LUNCH) ||
      (endHourOfSchedule >= BUSINESS_HOURS_CONSTANTS.START_LUNCH &&
        endHourOfSchedule < BUSINESS_HOURS_CONSTANTS.END_LUNCH)
    ) {
      throw new BadRequestException(
        'O Inicio e o fim do agendamento deve ser dentro do horário comercial',
      );
    }

    if (endHourOfSchedule > BUSINESS_HOURS_CONSTANTS.END_WORKING) {
      throw new BadRequestException(
        'O agendamento não pode ultrapassar às 18h',
      );
    }
  }
}
