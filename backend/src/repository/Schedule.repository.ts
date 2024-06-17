import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Schedule } from '@prisma/client';
import { Pagination } from 'src/types/pagination';
import { ScheduleModelType } from 'src/model/Schedule.model';
import moment from 'moment';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

@Injectable()
export class ScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  async listAll(data: Pagination<null>) {
    const { skip, take } = data.pagination;
    return this.prisma.schedule.findMany({
      skip,
      take,
    });
  }

  async listByDay(date: moment.Moment) {
    const startOfDay = date.startOf('day').toString();
    const endOfDay = date.endOf('day').toString();
    return this.prisma.schedule.findMany({
      where: {
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async create(data: ScheduleModelType) {
    const { licensePlate, washingType, startDate, endDate } = data;
    return this.prisma.schedule.create({
      data: {
        washingType,
        licensePlate,
        startDate,
        endDate,
      },
    });
  }

  async deleteById(id: number): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }

  async checkOverlapDate({ startDate, endDate }: DateRange): Promise<boolean> {
    const overlappingSchedules = await this.prisma.schedule.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    return overlappingSchedules.length > 0;
  }

  async get(id: number): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { id },
    });
  }
}
