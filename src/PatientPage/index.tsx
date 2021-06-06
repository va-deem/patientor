import React from 'react';
import axios from 'axios';
import {apiBaseUrl} from "../constants";
import {useStateValue, addPatient} from "../state";

import {Patient, Entry} from '../types';
import {useParams} from 'react-router-dom';
import {Container, List, ListItem, Icon} from "semantic-ui-react";

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

  if (!patients[id]) return null;

  const renderEntry = (entry: Entry): JSX.Element => {
    return (<ListItem>
      {`${entry.date} ${entry.description}`}
      {entry.diagnosisCodes?.length ?
        (<List>
          {entry.diagnosisCodes.map(code =>
            (<ListItem key={code}>{code}</ListItem>)
          )}
        </List>) : []}
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
        <List bulleted>
          {patients[id].entries.map((entry) => renderEntry(entry))}
        </List>
      </ListItem>
    </List>
  </div>;
};

export default PatientPage;
