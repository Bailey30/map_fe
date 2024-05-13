// import {validate(), allErrors}
// const errors = {
//     username: ["too long", "already exists"],
//     password: ["required"],
//     all: () => {
//         console.log("errors.all() ran")
//         // should run all functions that validate inputs
//         // should return object with keys that match with inputs that have errors
//     }

import { FormyState } from "./useFormyBoi";

// maybe - no errors.all() - there is just one function that validates everything that has been put into the config? or takes its own config
// and errors is an object returned from the hook that takes a config
//
//
export type errorsObj = {
  [key: string]: string | null;
};
type Options = {
  is: any;
  customResponse?: string;
};
export type Config = {
  name: string;
  value: string | number | undefined;
  required?: boolean | Options;
  minLen?: number | Options;
  maxLen?: number | Options;
  maxValue?: number | Options;
  isEqual?: any | Options;
  isPriceRegex?: boolean;
  mustMatchField?: string | Options;
};
export type ConfigArray = Config[];
type ValidationResponse = {
  valid: boolean;
  message?: string;
};
type FieldName = string | undefined;
type ValidationFunction = (
  input: Config,
  options?: any | Options,
  formyState?: FormyState,
) => ValidationResponse;
enum ValidationFunctionNames {
  required = "required",
  minLen = "minLen",
  maxLen = "maxLen",
  maxValue = "maxValue",
  minValue = "minValue",
  isEqual = "isEqual",
  mustMatchField = "mustMatchField",
}
type ValidationFunctions = {
  [Key in ValidationFunctionNames]: ValidationFunction;
};
// functions are indexed from here in Validate()
const validationFunction: ValidationFunctions = {
  [ValidationFunctionNames.required]: required,
  [ValidationFunctionNames.minLen]: minLen,
  [ValidationFunctionNames.isEqual]: isEqual,
  [ValidationFunctionNames.maxLen]: maxLen,
  [ValidationFunctionNames.maxValue]: maxValue,
  [ValidationFunctionNames.minValue]: minValue,
  [ValidationFunctionNames.mustMatchField]: mustMatchField,
};

// regex func types - not complete
export type RegexFunc = (
  input: number | string,
  custom?: string,
) => string | number | undefined;
enum RegexFuncNames {
  isPriceRegex = "isPriceRegex",
}
export type RegexFuncs = {
  [Key in RegexFuncNames]: RegexFunc;
};
export const regexFunction: RegexFuncs = {
  [RegexFuncNames.isPriceRegex]: isPriceRegex,
};

// Validation functions

function required(input: Config, options: Options) {
  console.log("required", input.value);
  if (!input.value || input.value === null) {
    return {
      valid: false,
      message: options.customResponse ?? `${input.name} is required`,
    };
  } else {
    return { valid: true };
  }
}

function minLen(input: Config, options: Options) {
  if (
    (input.value && String(input.value).length < options.is) ||
    !input.value
  ) {
    return {
      valid: false,
      message:
        options.customResponse ??
        `${input.name} needs to be atleast ${options.is} characters long`,
    };
  } else {
    return { valid: true };
  }
}

function maxLen(input: Config, options: Options) {
  if (input.value && String(input.value).length > options.is) {
    return {
      valid: false,
      message:
        options.customResponse ??
        `${input.name} needs to be less than ${options.is} characters long`,
    };
  } else {
    return { valid: true };
  }
}

function maxValue(input: Config, options: Options) {
  console.log(input);
  if (input.value && input.value > options.is) {
    return {
      valid: false,
      message:
        options.customResponse ?? `Value needs to be less than ${options.is}`,
    };
  } else {
    return { valid: true };
  }
}

function minValue(input: Config, options: Options) {
  if (input.value && input.value < options.is) {
    return {
      valid: false,
      message:
        options.customResponse ?? `Value needs to be more than ${options.is}`,
    };
  } else {
    return { valid: true };
  }
}

function isEqual(input: Config, options: Options) {
  if (input.value === options.is) {
    return {
      valid: false,
      message: options.customResponse ?? `${input.name} already exists`,
    };
  } else {
    return { valid: true };
  }
}

export function isPriceRegex(
  input: string | number,
): string | number | undefined {
  const regex = /^(\d*\.?\d*)?$/;
  if (regex.test(input as string)) {
    console.log("passed regex");
    return input;
  }
}

export function mustMatchField(
  input: Config,
  options: Options,
  formyState?: FormyState,
): ValidationResponse {
  console.log({ formyState });
  if (!formyState) {
    return {
      valid: false,
      message: "No value to compare it to",
    };
  }
  const valueToMatch = formyState[options.is];
  if (input.value !== valueToMatch) {
    return {
      valid: false,
      message: options.customResponse ?? "Fields do not match",
    };
  } else {
    return {
      valid: true,
    };
  }
}

// Main export
export function validate(
  config: ConfigArray,
  formyState?: FormyState,
): errorsObj {
  const errors: errorsObj = {};
  // for each input
  config.forEach((input: Config) => {
    // errors are null until proven otherwise, but field name must exists in errors object so state can be modified. Checks only care if the value is null or not
    errors[input.name] = null;
    // for each validation function
    // each key value pair is a function that validates the input (except for "name" and "value"), this goes over each pair
    Object.entries(input).forEach((entry) => {
      // key is the name of the function
      const [key, configValue]: [string, any] = entry;
      const functionKey = key as ValidationFunctionNames;

      // some functions dont need to run at the same time as other so are not counted as validators - also includes "name" and "value"
      if (isNotAValidator(functionKey)) return;

      // select the function using the function key from the config object
      const func: ValidationFunction = validationFunction[functionKey];

      // run the validation function. If value given is not an object, convert to options object
      const isValid: ValidationResponse = func(
        input,
        isOptions(configValue),
        formyState,
      );

      console.log({ isValid });

      if (isValid.valid === false) {
        errors[input.name] = isValid.message!;
      }
    });
  });
  return errors;
}

// Internal utils

const notFunctions = ["name", "value", "isPriceRegex"];

function isNotAValidator(key: string): boolean {
  return notFunctions.includes(key);
}

export function isOptions(value: any | Options): Options {
  if (typeof value === "object") {
    console.log("was options");
    return value;
  } else {
    return createOptions(value);
  }
}

// if an option object wasnt given, turn it into an object for the sake of consistency
function createOptions(value: any): Options {
  return {
    is: value,
  };
}

// regex functions are currently run onChange instead of onBlur or with everything else
export const regexFunctions = ["isPriceRegex", "regex"];

// External utils

// check if there are values that are not null in the object
export function hasErrors(errors: errorsObj) {
  let hasErrs = false;
  Object.values(errors).forEach((err) => {
    if (err !== null) {
      hasErrs = true;
    }
  });
  return hasErrs;
}
