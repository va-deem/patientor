import React from 'react';
import {
  List,
  ListItem,
  Icon,
  SemanticICONS,
  Segment
} from "semantic-ui-react";

import {Entry} from '../types';
import {useStateValue} from "../state";

const EntryDetails = ({entry}: { entry: Entry }) => {
  const [{diagnoses},] = useStateValue();

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const getCodeName = (code: string) => {
    const diagnose = diagnoses.find(el => el.code === code);
    return diagnose ? `${diagnose.code}: ${diagnose.name}` : null;
  };

  const renderEntryInfo = (entry: Entry, icon: SemanticICONS | undefined) =>
    (<Segment>
      <div className="content">
        <Icon name={icon} />
        {`${entry.date} ${entry.description}`}
        {entry.diagnosisCodes?.length ?
          (<List>
            {entry.diagnosisCodes.map(code =>

              (<ListItem key={code}>{getCodeName(code)}</ListItem>)
            )}
          </List>) : []}
      </div>
    </Segment>);

  // Exhaustive type checking
  switch (entry.type) {
    case "Hospital":
      return renderEntryInfo(entry, "hospital");
    case "HealthCheck":
      return renderEntryInfo(entry, "user doctor");
    case "OccupationalHealthcare":
      return renderEntryInfo(entry, "briefcase");
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
