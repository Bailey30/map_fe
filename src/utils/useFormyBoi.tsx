import { useCallback, useMemo, useReducer, useState } from "react";
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
const errorsReducer = (errors: errorsObj, action: any) => {
  switch (action.type) {
    case "SET_ERRORS":
      console.log({ action });
      // should it remove the field name from state if the error is null?
      // remove all console logs
      return {
        ...errors,
        ...action.errObj,
        // [action.name]: action.value,
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

  // state the holds the modified config array. Exists because the config needs to be modified after the user creates it.
  const [configState, setConfigState] = useState<ConfigArray>([]);

  function createConfigState(fieldsArr: ConfigArray) {
    const state: ConfigArray = [...fieldsArr];
    fieldsArr.forEach((field: Config) => {
      if (Object.hasOwn(field, "mustMatchField")) {
        // get the name of the field it must match
        const fieldToMatch = isOptions(field.mustMatchField).is;

        // get index of the config to modify
        const indexOfConfigToModify = state.findIndex(
          (f: Config) => f.name === fieldToMatch,
        );

        // get the config object out of the config array
        const configToModify = state.find(
          (f: Config) => f.name === fieldToMatch,
        );
        if (configToModify) {
          // modify the object in the array
          state[indexOfConfigToModify] = {
            ...configToModify,
            mustMatchField: field.name,
          };
        }
      }

      console.log({ state });

      setConfigState(state);

      return state;
    });
  }

  // creates the state object that holds values for the input fields
  // also creates regex function state
  function createState(fieldsArr: ConfigArray): FormyState {
    createConfigState(fieldsArr);
    const state: FormyState = {};
    fieldsArr.forEach((field: Config) => {
      createRegexFunctions(field);
      state[field.name] = field.value ?? "";
    });
    return state;
  }

  // state managing the values of the input fields
  const [values, valuesDispatch] = useReducer(
    valuesReducer,
    useMemo(() => createState(fields), [init]),
  );

  // state managing errors of the input fields
  const [errors, errorsDispatch] = useReducer(errorsReducer, {});

  // regex function are run onChange instead of onBlur so seperated into their own state
  function createRegexFunctions(field: Config): void {
    // if one of the keys in the config object has the name of a function that validates agaist regex
    if (regexFunctions.some((func) => Object.keys(field).includes(func))) {
      // get the name of the regex validator given to the field
      // is [0] because of filter function, and there is only one regex validator allowed
      const fieldRegex = Object.keys(field).filter((key: string) =>
        regexFunctions.includes(key),
      );
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

  // function that updates formy state, also checks values against any regex given
  const setValue = useCallback(
    (event: any) => {
      const { name, value } = event.target;
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
      const name = e?.target.name ?? "all";

      console.log({ name });

      console.log({ configState });
      // get the config of field and any fields that must match it
      const fieldsToValidate = getFieldsToValidate(configState, name);

      console.log({ fieldsToValidate });

      // update the array of fields with the current values from state
      const currentFieldWithFieldsToMatch = fieldsToValidate.map(
        (field: Config) => {
          return { ...field, value: values[field.name] };
        },
      );

      console.log({ currentFieldWithFieldsToMatch });

      // function that performs validation functions for the specific field
      const errObj = validate(currentFieldWithFieldsToMatch, values);

      console.log({ errObj });
      // const key = Object.keys(errObj)[0];
      // const value = Object.values(errObj)[0];
      // errorsDispatch({ type: "SET_ERRORS", name: key, value: value });
      errorsDispatch({ type: "SET_ERRORS", errObj });
    },
    [values, configState],
  );

  return { values, setValue, errors, validators };
}

// gets the config of the field in use (or just onBlurred) and any fields which must match it. Currently only matters for matching passwords
function getFieldsToValidate(
  configState: ConfigArray,
  name: string,
): ConfigArray {
  console.log({ configState });
  console.log({ name });
  // get the config for the field from the array of fields
  const field =
    name === "all"
      ? configState
      : configState.filter((field: Config) => field.name === name);

  console.log({ field });

  // get any fields that match the mustMatch field key
  const matchFields = configState.filter(
    (f: Config) => isOptions(field[0].mustMatchField).is === f.name,
  );

  // join the array of fields to be validated
  // matching fields need to be validated at the same time
  const allFields = field.concat(matchFields);

  return allFields;
}
