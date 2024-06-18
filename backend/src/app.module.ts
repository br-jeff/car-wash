import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleController } from './controller/schedule.controller';
import { ScheduleRepository } from './repository/Schedule.repository';
import { PrismaService } from './services/prisma.service';
import { CreateScheduleUseCase } from './use-case/create-schedule-use-case';
import { ListAvalibleScheduleUseCase } from './use-case/list-avalible-schedule-use-case';

@Module({
  imports: [],
  controllers: [AppController, ScheduleController],
  providers: [
    AppService,
    PrismaService,
    ScheduleRepository,
    CreateScheduleUseCase,
    ListAvalibleScheduleUseCase,
  ],
})
export class AppModule {}
