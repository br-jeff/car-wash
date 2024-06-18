import { Form, Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import ScheduleService from '../services/api';
import washingTypeEnum from '../enums/washType.enum';
import { ToastContainer, toast } from 'react-toastify';
import {
  FormContainer,
  StyledForm,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StyledButton,
  ErrorDiv,
} from './home.style';

import 'react-toastify/dist/ReactToastify.css';
import Menu from '../components/Menu';

const REQUIRED_TEXT = (field: string) => `O campo ${field} é obrigatório`

function checkTime(value: string, ctx: Yup.TestContext<Yup.AnyObject>) {
  const { createError } = ctx;

  if (!(/^([0-9][0-9]):[0-5][0-9]$/.test(value))) {
    return createError({ message: 'Formato do Horário inválido' });
  }

  const [hour, minute] = value.split(':')
  const todayHour = moment().set({ hour: Number(hour), minute: Number(minute) })
  if (!todayHour.isValid()) {
    return createError({ message: 'Horário não existe' });
  }

  if (todayHour.isAfter(moment().set({ hour: 18 })) || todayHour.isBefore(moment().set({ hour: 10 }))) {
    return createError({ message: 'Horário de funcionamento é das 10:00h as 18:00h' });
  }

  return true
};

function checkDay(value: string, ctx: Yup.TestContext<Yup.AnyObject>) {
  const { createError } = ctx;
  const [day, month, year] = value.split('/')

  console.log({ day, month, year })
  if (!day || !month || !year) {
    return createError({ message: 'Data errada' });
  }
  const date = moment({
    day: Number(day),
    month: Number(month),
    year: Number(year)
  })

  if (!date.isValid()) {
    return createError({ message: 'Data Invalida' });
  }

  const DAYS_OF_WEEK = {
    MONDAY: 3,
    TUESDAY: 4,
    WEDNESDAY: 5,
    THURSDAY: 6,
    FRIDAY: 0,
    SATURDAY: 1,
    SUNDAY: 2,
  };

  if (date.weekday() === DAYS_OF_WEEK.SATURDAY || date.weekday() === DAYS_OF_WEEK.SUNDAY) {
    return createError({ message: 'Funcionamento de segunda a sexta-feira' });
  }

  return true
};

const ScheduleSchema = Yup.object().shape({
  licensePlate: Yup.string().trim()
    .matches(/[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/, { message: 'A placa não é mercosul' })
    .required(REQUIRED_TEXT('Placa')),
  day: Yup.string().required().test((value, ctx) => checkDay(value, ctx)),
  washingType: Yup.string().required(REQUIRED_TEXT('Tipo de lavagem'))
    .oneOf(Object.values(washingTypeEnum), 'Tipo de lavagem não existe'),
  hour: Yup.string()
    .required(REQUIRED_TEXT('Hora'))
    .test((value, ctx) => checkTime(value, ctx)),
});

export default function Home() {
  return (
    <div>
      <Menu />
      <Formik
        initialValues={{
          licensePlate: 'DIV3I14',
          day: moment().format('DD/MM/YYYY'),
          hour: moment().format('HH:mm'),
          washingType: 'SIMPLE',
        }}
        validationSchema={ScheduleSchema}
        onSubmit={async (values, { setSubmitting }) => {
          
          try {
            const { licensePlate } = values
            const washingType = values.washingType as 'SIMPLE' | 'FULL'
            const [day, month, year] = values.day.split('/')
            const [hour, minute] = values.hour.split(':')
            const schedule = {
              licensePlate,
              washingType,
              startDate: moment({
                day: Number(day),
                month: Number(month),
                year: Number(year),
                hour: Number(hour),
                minutes: Number(minute)
              }).toDate()
            }

            const newSchedule = await ScheduleService.createSchedule(schedule);

            if (newSchedule.isError) {
              toast.error(newSchedule.message);
            }

            toast.success('Sucesso');

          } catch (error) {
            toast.error('Error');
            console.log(error)
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, values }) => (
          <>
            <ToastContainer />
            <FormContainer>
              <StyledForm>
                <StyledLabel htmlFor="licensePlate">Placa do Veículo</StyledLabel>
                <StyledInput id="licensePlate" name="licensePlate" />
                {errors.licensePlate && touched.licensePlate ? <ErrorDiv>{errors.licensePlate}</ErrorDiv> : null}

                <StyledLabel htmlFor="day">Dia</StyledLabel>
                <StyledInput disabled={!values.licensePlate || errors.licensePlate} id="day" name="day" />
                {errors.day && touched.day ? <ErrorDiv>{errors.day}</ErrorDiv> : null}

                <StyledLabel htmlFor="washingType">Tipo de lavagem</StyledLabel>
                <StyledSelect disabled={!values.day || errors.day} as="select" id="washingType" name="washingType">
                  <option value="SIMPLE">Simples</option>
                  <option value="FULL">Completo</option>
                </StyledSelect>
                {errors.washingType && touched.washingType ? <ErrorDiv>{errors.washingType}</ErrorDiv> : null}

                <StyledLabel htmlFor="hour">Hora</StyledLabel>
                <StyledInput disabled={!values.day || !values.licensePlate || errors.day || errors.licensePlate} id="hour" name="hour" />

                {errors.hour && touched.hour ? <ErrorDiv>{errors.hour}</ErrorDiv> : null}

                <StyledButton type="submit">Adicionar</StyledButton>
              </StyledForm>
            </FormContainer>
          </>
        )}
      </Formik>
    </div>
  );
}
