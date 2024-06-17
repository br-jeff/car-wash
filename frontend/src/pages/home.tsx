import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import WashTypeEnum from '../enums/washType.enum';

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


const ScheduleSchema = Yup.object().shape({
    licensePlate: Yup.string().trim()
        //  .matches(/[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/, { message: 'A placa não é mercosul' })
        .required(REQUIRED_TEXT('Placa')),
    day: Yup.string().required(),
    washType: Yup.string().required(REQUIRED_TEXT('Tipo de lavagem')),
        // .oneOf(Object.values(WashTypeEnum), 'Tipo de lavagem não existe'),
    hour: Yup.string()
    //.required(REQUIRED_TEXT('Hora'))
    // .test((value, ctx) => checkTime(value, ctx)),
});

export default function Home() {
    return (
        <div>
            <h1>Anywhere in your app!</h1>
            <Formik
                initialValues={{ licensePlate: '', day: moment().format('DD/MM/YYYY'), hour: '', washType: moment().format('hh:mm') }}
                validationSchema={ScheduleSchema}
                onSubmit={values => {
                    const {licensePlate,washType } = values
                    const [day, month, year] = values.day.split('/')
                    const [hour, minute] = values.hour.split(':')
                    const schedule = {
                        licensePlate,
                        washType,
                        date: moment({
                            day: Number(day),
                            month: Number(month),
                            year: Number(year),
                            hour: Number(hour),
                            minutes: Number(minute)
                        })
                    }
                    console.log({schedule})
                }}>
                {({ errors, touched }) => (
                    <Form>
                        <label htmlFor="licensePlate">Placa do Veículo</label>
                        <Field id="licensePlate" name="licensePlate" />
                        {errors.licensePlate && touched.licensePlate ? (
                            <div>{errors.licensePlate}</div>
                        ) : null}

                        <label htmlFor="day">Dia</label>
                        <Field id="day" name="day" />
                        {errors.day && touched.day ? (
                            <div>{errors.day}</div>
                        ) : null}

                        <label htmlFor="washType">Tipo de lavagem</label>
                        <Field as="select" id="washType" name="washType">
                            <option value="simple">Simples</option>
                            <option value="full">Completo</option>
                        </Field>
                        {errors.washType && touched.washType ? <div>{errors.washType}</div> : null}

                        <label htmlFor="hour">Hora</label>

                        <Field id="hour" name="hour" />
                        {errors.hour && touched.hour ? <div>{errors.hour}</div> : null}
                        <button type="submit">Adicionar</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}