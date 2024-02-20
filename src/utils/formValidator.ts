// import {validate(), allErrors}



// const errors = {
//     username: ["too long", "already exists"],
//     password: ["required"],
//     all: () => {
//         console.log("errors.all() ran")
//         // should run all functions that validate inputs
//         // should return object with keys that match with inputs that have errors
//     }


// maybe - no errors.all() - there is just one function that validates everything that has been put into the config? or takes its own config
// and errors is an object returned from the hook that takes a config
//
//
type errorsObj = {
    [key: string]: string
}
type Options = {
    is: any,
    customResponse?: string
}
type Config = {
    field: string,
    value: string | undefined,
    required?: boolean | Options,
    minLen?: number | Options,
    maxLen?: number | Options
    isEqual?: any | Options,
}
type ConfigArray = Config[]
type ValidationResponse = {
    valid: boolean,
    message?: string
}
type FieldName = string | undefined
type ValidationFunction = (input: Config, configValue?: any) => ValidationResponse
enum ValidationFunctionNames {
    required = "required",
    minLen = "minLen",
    maxLen = "maxLen",
    isEqual = "isEqual",
}
type ValidationFunctions = {
    [Key in ValidationFunctionNames]: ValidationFunction
}

const validationFunction: ValidationFunctions = {
    [ValidationFunctionNames.required]: required,
    [ValidationFunctionNames.minLen]: minLen,
    [ValidationFunctionNames.isEqual]: isEqual,
    [ValidationFunctionNames.maxLen]: maxLen
}


// Validation functions

function required(input: Config, options: Options) {
    if (!input.value) {
        return { valid: false, message: options.customResponse ?? `${input.field} is required` }
    } else {
        return { valid: true }
    }
}

function minLen(input: Config, options: Options) {
    if (input.value && input.value.length < options.is) {
        return { valid: false, message: options.customResponse ?? `${input.field} needs to be atleast ${options.is} characters long` }
    } else {
        return { valid: true }
    }
}

function maxLen(input: Config, options: Options) {
    if (input.value && input.value.length > options.is) {
        return { valid: false, message: options.customResponse ?? `${input.field} needs to be less than ${options.is} characters long` }
    } else {
        return { valid: true }
    }
}

function isEqual(input: Config, options: Options) {
    if (input.value && input.value === options.is) {
        return { valid: false, message: options.customResponse ?? `${input.field} already exists` }
    } else {
        return { valid: true }
    }
}

// Main export
export function validate(config: ConfigArray) {
    const errors: errorsObj = {}

    config.forEach((input: Config) => {

        Object.entries(input).forEach(entry => {
            const [key, configValue]: [string, any] = entry
            const functionKey = key as ValidationFunctionNames

            if (notFunctions.includes(functionKey)) return

            const func: ValidationFunction = validationFunction[functionKey]

            // run the validation function. If value given is not an object, convert to options object
            const isValid: ValidationResponse = func(input, isOptions(configValue))

            if (isValid.valid === false) {
                errors[input.field] = isValid.message!
            }
        })
    })
    return errors
}


// Internal utils

const notFunctions = ["field", "value"]

function isOptions(value: any | Options): Options {
    console.log({ value })
    if ((value as Options)) {
        return value
    } else {
        return createOptions(value)
    }
}

function createOptions(value: any): Options {
    return {
        is: value
    }
}


// External utils

export function hasErrors(errors: errorsObj) {
    if (Object.keys(errors).length > 0) {
        return true
    } else {
        return false
    }
}







