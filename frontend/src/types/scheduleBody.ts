export type ScheduleBodyType = {
    licensePlate: string;
    washingType: 'SIMPLE' | 'FULL';
    startDate: Date | string
};