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
export type errorsObj = {
    [key: string]: string
}
type Options = {
    is: any,
    customResponse?: string
}
export type Config = {
    name: string,
    value: string | undefined,
    required?: boolean | Options,
    minLen?: number | Options,
    maxLen?: number | Options
    isEqual?: any | Options,
    isPriceRegex?: boolean
}
export type ConfigArray = Config[]
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

export type RegexFunc = (input: number | string, custom?: string) => string | number | undefined
enum RegexFuncNames {
    isPriceRegex = "isPriceRegex"
}
export type RegexFuncs = {
    [Key in RegexFuncNames]: RegexFunc
}
export const regexFunction: RegexFuncs = {
    [RegexFuncNames.isPriceRegex]: isPriceRegex
}


// Validation functions

function required(input: Config, options: Options) {
    if (!input.value) {
        return { valid: false, message: options.customResponse ?? `${input.name} is required` }
    } else {
        return { valid: true }
    }
}

function minLen(input: Config, options: Options) {
    if ((input.value && input.value.length < options.is) || !input.value) {
        return { valid: false, message: options.customResponse ?? `${input.name} needs to be atleast ${options.is} characters long` }
    } else {
        return { valid: true }
    }
}

function maxLen(input: Config, options: Options) {
    if (input.value && input.value.length > options.is) {
        return { valid: false, message: options.customResponse ?? `${input.name} needs to be less than ${options.is} characters long` }
    } else {
        return { valid: true }
    }
}

function isEqual(input: Config, options: Options) {
    if (input.value === options.is) {
        return { valid: false, message: options.customResponse ?? `${input.name} already exists` }
    } else {
        return { valid: true }
    }
}

export function isPriceRegex(input: string | number): string | number | undefined {
    console.log("ispriceregex")
    console.log({ input })
    const regex = /^\d*\.?\d*$/;
    if (regex.test(input as string)) {
        console.log("passed regex")
        return input
    }
}

// Main export
export function validate(config: ConfigArray): errorsObj {
    const errors: errorsObj = {}

    config.forEach((input: Config) => {

        Object.entries(input).forEach(entry => {
            const [key, configValue]: [string, any] = entry
            const functionKey = key as ValidationFunctionNames

            if (isNotAValidator(functionKey)) return

            const func: ValidationFunction = validationFunction[functionKey]

            // run the validation function. If value given is not an object, convert to options object
            const isValid: ValidationResponse = func(input, isOptions(configValue))

            if (isValid.valid === false) {
                errors[input.name] = isValid.message!
            }
        })
    })
    return errors
}


// Internal utils

const notFunctions = ["name", "value", "isPriceRegex"]

function isNotAValidator(key: string): boolean {
    return notFunctions.includes(key)
}

function isOptions(value: any | Options): Options {
    if (typeof value === "object") {
        console.log("was options")
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

export const regexFunctions = ["isPriceRegex", "regex"]


// External utils

export function hasErrors(errors: errorsObj) {
    if (Object.keys(errors).length > 0) {
        return true
    } else {
        return false
    }
}







