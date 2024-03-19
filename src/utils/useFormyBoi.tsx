import { useCallback, useReducer } from "react";
import { Config, ConfigArray, validate, errorsObj } from "./formValidator";
import { Dispatch } from "react";


const reducer = (state: FormyState, action: any) => {
    switch (action.type) {
        case "SET_STATE":
            return {
                ...state,
                [action.field]: action.value,
            }
        default:
            return state
    }
}


export default function UseFormyBoi(fields: ConfigArray): (FormyState | ((event: any) => void) | Validators)[] {
    const [values, dispatch] = useReducer(reducer, createState(fields))

    // const setStates = createDispatches(fields, dispatch)

    const setValue = useCallback((event: any) => {
        const { name, value } = event.target;
        dispatch({ type: 'SET_STATE', field: name, value });
    }, [fields]);

    const validators = createValidators(fields)

    return [values, setValue, validators]
}

type Dispatches = {
    [key: string]: (value: string | number) => void
}
function createDispatches(fields: ConfigArray, dispatch: Dispatch<any>): Dispatches {
    const dispatches: Dispatches = {}
    fields.forEach((field: Config) => {
        dispatches[field.field] = function(value: string | number) {
            dispatch({ type: "SET_STATE", field: field.field, value: value })
        }
    })
    return dispatches
}

type FormyState = {
    [key: string]: number | string | undefined
}
function createState(fields: ConfigArray): FormyState {
    const state: FormyState = {}
    fields.forEach((field: Config) => {
        console.log(field.value)
        state[field.field] = field.value ?? ""
    })
    return state
}

type Validators = {
    [key: string]: errorsObj // maybe return array instead
}
function createValidators(fields: ConfigArray): Validators {
    const validators: Validators = {}
    fields.forEach((field: Config) => {
        validators[field.field] = validate([field])
    })
    return validators
}

