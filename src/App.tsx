import React from "react";
import axios from "axios";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import {Button, Divider, Header, Container} from "semantic-ui-react";

import {apiBaseUrl} from "./constants";
import {useStateValue, setPatientList} from "./state";
import {Patient} from "./types";

import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientPage";

const App = () => {
  const [, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const {data: patientListFromApi} = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route exact path="/">
              <PatientListPage />
            </Route>
            <Route path="/patients/:id" >
              <PatientPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
