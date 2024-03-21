import { useCallback, useMemo, useReducer } from "react";
import { Config, ConfigArray, validate, errorsObj, regexFunctions, regexFunction, RegexFunc, RegexFuncs } from "./formValidator";

type FormyState = {
    [value: string]: number | string | undefined
}
const valuesReducer = (state: FormyState, action: any) => {
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

type Errors = {
    [key: string]: errorsObj
}
const errorsReducer = (errors: Errors, action: any) => {
    switch (action.type) {
        case "SET_ERRORS":
            return {
                ...errors,
                [action.name]: action.value
            }
        default:
            return errors
    }
}

type FieldRegex = {
    [name: string]: string
}
const regexReducer = (fieldRegex: FieldRegex, action: any) => {
    switch (action.type) {
        case "SET_REGEX":
            return {
                ...fieldRegex,
                [action.name]: action.value
            }
        default:
            return fieldRegex
    }
}

export default function UseFormyBoi(fields: ConfigArray, init: string = "init") {
    const [regexFuncState, regexFuncDispatch] = useReducer(regexReducer, {})

    function createState(fieldsArr: ConfigArray): FormyState {
        console.log("createstate")
        const state: FormyState = {}
        fieldsArr.forEach((field: Config) => {
            createRegexFunctions(field)
            state[field.name] = field.value ?? ""
        })
        return state
    }

    const [values, valuesDispatch] = useReducer(valuesReducer, useMemo(() => createState(fields), [init]))
    const [errors, errorsDispatch] = useReducer(errorsReducer, {})

    function createRegexFunctions(field: Config): void {
        if (regexFunctions.some(func => Object.keys(field).includes(func))) {
            const fieldRegex = Object.keys(field).filter((key: string) => regexFunctions.includes(key))
            regexFuncDispatch({ type: "SET_REGEX", name: field.name, value: fieldRegex[0] })
        }
    }

    function handleAnyRegex(name: string, value: any): string | number | undefined {
        const regexFuncName = regexFuncState[name] ?? ""
        const regexFunc: RegexFunc = regexFuncName ? regexFunction[regexFuncName as keyof RegexFuncs] : (value: any) => value
        return regexFunc(value)
    }

    const setValue = useCallback((event: any) => {
        const { name, value } = event.target;
        const handledValue = handleAnyRegex(name, value)
        if (handledValue !== undefined) {
            valuesDispatch({ type: 'SET_STATE', field: name, value: handledValue });
        }
    }, [regexFuncState]);

    const validators = useCallback((e?: React.ChangeEvent<any>) => {
        const { name } = e?.target
        const field = fields.filter((field: Config) => field.name === name)
        const errObj = validate(field)
        const key = Object.keys(errObj)[0]
        const value = Object.values(errObj)[0]
        console.log("validators")
        errorsDispatch({ type: "SET_ERRORS", name: key, value: value })
    }, [init])

    return { values, setValue, errors, validators }
}


