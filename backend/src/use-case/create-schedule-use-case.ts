import { Injectable } from "@nestjs/common"
import moment from "moment"
import WashTypeEnum from "src/enums/washType.enum"
import { SchduleModelType } from "src/model/Schedule.model"
import { ScheduleRepository } from "src/repository/Schedule.repository"


@Injectable()
export class CreateScheduleUseCase {
    constructor(
        private scheduleRepository: ScheduleRepository,
      ) { }
    async execute(data : Omit<SchduleModelType, 'endDate'>) {

    let endDate = moment(data.startDate)

    if (data.washType === WashTypeEnum.FULL) {
      endDate.add({ minutes: 45 }).toISOString()
    } else if (data.washType === WashTypeEnum.SIMPLE) {
      endDate.add({ minutes: 30 })
    }

    endDate.toDate()
    const hasOverLap = await this.scheduleRepository.checkOverlapDate({ startDate: data.startDate, endDate })

    if(!hasOverLap) {
      console.log('Não tem overlap')
    }

    return this.scheduleRepository.create({
      ...data,
      endDate: endDate
    });
    }
}