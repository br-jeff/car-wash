export type SchduleModelType = {
    licensePlate: string;
    washType: 'SIMPLE' | 'FULL';
    startDate: Date | string
    endDate: Date | string
};