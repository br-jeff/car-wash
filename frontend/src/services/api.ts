import axios from 'axios';
import { ScheduleBodyType } from '../types/scheduleBody';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ApiService = axios.create({
    baseURL: backendUrl,
});

const ScheduleService = {
    async fetchSchedules() {
        try {
            const response = await ApiService.get('/schedule');
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar os agendamentos');
        }
    },

    async createSchedule(scheduleData: ScheduleBodyType) {
        try {
            const response = await ApiService.post('/schedule', scheduleData);
            
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar o agendamento');
        }
    },
};

export default ScheduleService;
