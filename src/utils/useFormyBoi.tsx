import { useCallback, useMemo, useReducer } from "react";
import {
  Config,
  ConfigArray,
  validate,
  errorsObj,
  regexFunctions,
  regexFunction,
  RegexFunc,
  RegexFuncs,
  mustMatchField,
  isOptions,
} from "./formValidator";

export type FormyState = {
  [value: string]: number | string | undefined;
};
const valuesReducer = (state: FormyState, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

type Errors = {
  [key: string]: errorsObj;
};
const errorsReducer = (errors: Errors, action: any) => {
  switch (action.type) {
    case "SET_ERRORS":
      console.log({ action });
      // should it remove the field name from state if the error is null?
      // remove all console logs
      return {
        ...errors,
        [action.name]: action.value,
      };
    default:
      return errors;
  }
};

type FieldRegex = {
  [name: string]: string;
};
const regexReducer = (fieldRegex: FieldRegex, action: any) => {
  switch (action.type) {
    case "SET_REGEX":
      return {
        ...fieldRegex,
        [action.name]: action.value,
      };
    default:
      return fieldRegex;
  }
};

export default function UseFormyBoi(
  fields: ConfigArray,
  init: string = "init",
) {
  const [regexFuncState, regexFuncDispatch] = useReducer(regexReducer, {});

  function createState(fieldsArr: ConfigArray): FormyState {
    const state: FormyState = {};
    fieldsArr.forEach((field: Config) => {
      createRegexFunctions(field);
      state[field.name] = field.value ?? "";
    });
    return state;
  }

  const [values, valuesDispatch] = useReducer(
    valuesReducer,
    useMemo(() => createState(fields), [init]),
  );
  const [errors, errorsDispatch] = useReducer(errorsReducer, {});

  function createRegexFunctions(field: Config): void {
    // if one of the keys in the config object has the name of a function that validates agaist regex
    if (regexFunctions.some((func) => Object.keys(field).includes(func))) {
      // get the name of the regex validator given to the field
      // is [0] because of filter function, and there is only one regex validator allowed
      const fieldRegex = Object.keys(field).filter((key: string) =>
        regexFunctions.includes(key),
      );
      console.log({ fieldRegex });
      regexFuncDispatch({
        type: "SET_REGEX",
        name: field.name,
        value: fieldRegex[0],
      });
    }
  }

  // regex validators are currently run onChange instead of onBlur like everything else
  function handleAnyRegex(
    name: string,
    value: any,
  ): string | number | undefined {
    const regexFuncName = regexFuncState[name] ?? "";
    // if there is a necessary regex function, do that function, otherwise pass the value through a blank function
    const regexFunc: RegexFunc = regexFuncName
      ? regexFunction[regexFuncName as keyof RegexFuncs]
      : (value: any) => value;
    return regexFunc(value);
  }

  const setValue = useCallback(
    (event: any) => {
      console.log("set value");
      const { name, value } = event.target;
      console.log({ name });
      const handledValue = handleAnyRegex(name, value);
      if (handledValue !== undefined) {
        valuesDispatch({ type: "SET_STATE", field: name, value: handledValue });
      }
    },
    [regexFuncState],
  );

  // function that performs any validation function
  const validators = useCallback(
    (e?: React.ChangeEvent<any>) => {
      const { name } = e?.target;
      // get the config for the field from the array of fields
      const field = fields.filter((field: Config) => field.name === name);
      // function that performs validation functions for the specific field

      const fieldWithCurrentValue = {
        ...field[0],
        value: values[field[0].name],
      };
      console.log({ fieldWithCurrentValue });
      const errObj = validate([fieldWithCurrentValue], values);

      // handle mustMatc here
      // const matches = handleMustMatch(field[0], values);

      const key = Object.keys(errObj)[0];
      const value = Object.values(errObj)[0];
      console.log("validators");
      errorsDispatch({ type: "SET_ERRORS", name: key, value: value });
    },
    [values],
  );

  return { values, setValue, errors, validators };
}

function handleMustMatch(field: Config, values: FormyState) {
  if (Object.hasOwn(field, "mustMatchField")) {
    // const valueToMatch = values.filter((fieldToMatch: Config) => fieldToMatch.name === field.mustMatchField && fieldToMatch.)
    // const valueToMatch = values[field.name];
    // const matches = mustMatchField(
    //   field,
    //   isOptions(field.mustMatchField),
    //   valueToMatch,
    // );
    // return matches;
  } else {
    return null;
  }
}
