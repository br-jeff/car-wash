import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import {
    TableHeaderCell, TableCell, TableRow, TableBody, TableHeader,
    Table, ContainerList,
    PaginationContainer
} from './list.style';
import { StyledButton } from './home.style';
import axios from 'axios';

type ScheduleItem = {
    id: number;
    licensePlate: string;
    washingType: 'SIMPLE' | 'COMPLEX';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
};

type ApiResponse = ScheduleItem[];

type ScheduleTableProps = {};

const ScheduleTable: React.FC<ScheduleTableProps> = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            const size = 10;
            const response = await axios.get(`http://localhost:3000/schedule?size=${size}&page=${currentPage}`);
            const data: ApiResponse = response.data;
            setScheduleData(data);
            const totalCount = parseInt(response.headers['x-total-count'] || '0', size);
            const totalPages = Math.ceil(totalCount / size);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const deleteSchedule = async (id: number) => {
        const shouldDelete = window.confirm('Tem certeza que deseja excluir este agendamento?');
        if (!shouldDelete) return
        try {
            await axios.delete(`http://localhost:3000/schedule/${id}`);
            const activeScheduleData = scheduleData.filter(scd => scd.id !== id)
            setScheduleData(activeScheduleData)
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
        }
    };
    
    return (
        <div>
            <Menu />
            <ContainerList>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>Placa</TableHeaderCell>
                            <TableHeaderCell>Tipo de Lavagem</TableHeaderCell>
                            <TableHeaderCell>Data de Início</TableHeaderCell>
                            <TableHeaderCell>Data de Término</TableHeaderCell>
                            <TableHeaderCell>Deletar</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduleData.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell>{schedule.id}</TableCell>
                                <TableCell>{schedule.licensePlate}</TableCell>
                                <TableCell>{schedule.washingType}</TableCell>
                                <TableCell>{new Date(schedule.startDate).toLocaleString()}</TableCell>
                                <TableCell>{new Date(schedule.endDate).toLocaleString()}</TableCell>
                                <TableCell onClick={() => deleteSchedule(schedule.id)}>&nbsp;&nbsp;&nbsp;&nbsp; X </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationContainer>
                    <StyledButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Página Anterior
                    </StyledButton>
                    <StyledButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Próxima Página
                    </StyledButton>
                </PaginationContainer>
            </ContainerList>
        </div>
    );
};

export default ScheduleTable;
