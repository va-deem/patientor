import React, {useState} from 'react';
import {Field, Formik, Form} from "formik";

import {useStateValue} from "../state";
import {
  DiagnosisSelection,
  NumberField,
  TextField
} from "../AddPatientModal/FormField";
import {Button, Grid} from "semantic-ui-react";
import {Entry, HealthCheckRating} from "../types";

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryFormValues = UnionOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const isWrongDateFormat = (date: string) => /[0-9]{4}-[1-9]{2}-[1-9]{2}/g.exec(date) === null;

const AddEntryForm = ({onSubmit, onCancel}: Props) => {
  const [{diagnoses}] = useStateValue();
  const [currentType, setType] = useState('HealthCheck');

  return (
    <>
      <form>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="HealthCheck">{"HealthCheck"}</option>
          <option value="Hospital">{"Hospital"}</option>
          <option
            value="OccupationalHealthcare">{"OccupationalHealthcare"}</option>
        </select>
      </form>

      <Formik
        initialValues={{
          description: '',
          date: '',
          specialist: '',
          type: 'HealthCheck',
          healthCheckRating: HealthCheckRating.Healthy,
        }}
        onSubmit={onSubmit}
        validate={values => {
          const requiredError = "Field is required";
          const dateFormatError = "Date format should be 2000-11-22";
          const errors: { [field: string]: string } = {};

          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.date) {
            errors.date = requiredError;
          }
          if (isWrongDateFormat(values.date)) {
            errors.date = dateFormatError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          return errors;
        }}>
        {({isValid, dirty, setFieldValue, setFieldTouched}) => {
          return (<Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {currentType && currentType === 'HealthCheck' ?
              <Field
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              /> : null}
            {currentType && currentType === 'OccupationalHealthcare' ?
              <>
                <Field
                  label="Employer's Name"
                  placeholder="employerName"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick Leave, start"
                  name="sickLeave[startDate]"
                  component={TextField}
                />
                <Field
                  label="Sick Leave, end"
                  name="sickLeave[endDate]"
                  component={TextField}
                />
              </>
              : null}
            {currentType && currentType === 'Hospital' ?
              <>
                <Field
                  label="Discharge, date"
                  name="discharge[date]"
                  component={TextField}
                />
                <Field
                  label="Discharge, criteria"
                  name="discharge[criteria]"
                  component={TextField}
                />
              </>
              : null}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>);
        }}
      </Formik>
    </>);
};

export default AddEntryForm;
