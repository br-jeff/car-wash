import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background-color: #f2f2f2;
`;

export const TableBody  = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
`;

export const TableHeaderCell  = styled.th`
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #e6e6e6;
  font-weight: bold;
`;

export const ContainerList  = styled.div`
  width: 90%;
  height: 90%;
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

export const PaginationContainer = styled.div`
   text-align: center;
   margin: 10px auto; 
   margin-left: 10px; 
`;


