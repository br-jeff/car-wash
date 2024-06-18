import styled from 'styled-components';
import { Field } from 'formik';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 300px;
  margin: 0 auto;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

export const StyledInput = styled(Field)`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
`;

export const StyledSelect = styled(Field)`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 275px;
`;

export const StyledButton = styled.button`
  padding: 10px 15px;
  background-color: #9580ff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #8870FF;
  }
`;

export const ErrorDiv = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 2px;
  margin-bottom: 8px;
  
`;

export const TitlleApp = styled.h1`
  font-size: 24px; 
  text-align: center;
  color: #fafafa;
  background-color: #9580ff;
  margin: 0;
  padding: 16px 0; 
  margin-bottom: 10px; 
`;
