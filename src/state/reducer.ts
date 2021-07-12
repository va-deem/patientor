import {State} from "./state";
import {Patient, DiagnoseEntry, Entry} from "../types";

export type Action =
  | {
  type: "SET_PATIENT_LIST";
  payload: Patient[];
}
  | {
  type: "ADD_PATIENT";
  payload: Patient;
}
  | {
  type: "ADD_DIAGNOSES";
  payload: DiagnoseEntry[];
} | {
  type: "ADD_ENTRY";
  id: string,
  payload: Entry[];
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({...memo, [patient.id]: patient}),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_DIAGNOSES":
      return {
        ...state,
        diagnoses: [...action.payload],
      };
    case "ADD_ENTRY":
      const newPatient = state.patients[action.id];
      newPatient.entries = [...action.payload];
      return {
        ...state,
        patients: {
          ...state.patients,
          [newPatient.id]: newPatient
        }
      };
    default:
      return state;
  }
};

// Action creators
export const setPatientList = (payload: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload
  };
};

export const addDiagnoses = (payload: DiagnoseEntry[]): Action => {
  return {
    type: "ADD_DIAGNOSES",
    payload
  };
};

export const addEntry = (id: string, payload: Entry[]): Action => {
  return {
    type: "ADD_ENTRY",
    id,
    payload
  };
};
