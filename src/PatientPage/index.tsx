import React from 'react';
import axios from 'axios';
import {apiBaseUrl} from "../constants";
import {useStateValue, addPatient, addDiagnoses} from "../state";

import {Patient, Entry, DiagnoseEntry} from '../types';
import {useParams} from 'react-router-dom';
import {Container, List, ListItem, Icon} from "semantic-ui-react";
import EntryDetails from './EntryDetails';

const PatientPage = () => {
  const {id} = useParams<{ id: string }>();
  const [{patients}, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const {data: patientFromApi} = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!patients[id]) {
      void fetchPatient();
    }
  }, []);

  React.useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const {data: diagnosesFromApi} = await axios.get<DiagnoseEntry[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(addDiagnoses(diagnosesFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, []);

  if (!patients[id]) return null;

  const renderEntry = (entry: Entry): JSX.Element => {
    return (<ListItem>
      <EntryDetails entry={entry} />
    </ListItem>);
  };

  return <div className="App">
    <Container textAlign="center">
      <h3>{patients[id].name}</h3>
    </Container>
    <List>
      <List.Item>Id: {patients[id].id}</List.Item>
      <List.Item>Gender: {patients[id].gender === 'male' ?
        <Icon name="mars" /> : <Icon name="venus" />}</List.Item>
      <List.Item>SSN: {patients[id].ssn}</List.Item>
      <List.Item>Occupation: {patients[id].occupation}</List.Item>
      <ListItem>
        <List>
          {patients[id].entries.map((entry) => renderEntry(entry))}
        </List>
      </ListItem>
    </List>
  </div>;
};

export default PatientPage;
