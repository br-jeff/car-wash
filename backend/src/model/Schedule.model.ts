export type ScheduleModelType = {
  licensePlate: string;
  washingType: 'SIMPLE' | 'FULL';
  startDate: Date | string;
  endDate: Date | string;
};
