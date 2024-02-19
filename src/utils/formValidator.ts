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
type Config = {
    field: string,
    value: string | undefined,
    required?: boolean,
    minLen?: number
}
type ConfigArray = Config[]

type ValidationResponse = {
    valid: boolean,
    message?: string
}
type FieldName = string | undefined

type ValidationFunction = (value: any, configValue?: any, fieldName?: FieldName) => ValidationResponse

enum ValidationFunctionNames {
    required = "required",
    minLen = "minLen"
}
type ValidationFunctions = {
    [Key in ValidationFunctionNames]: ValidationFunction
}

const validationFunction: ValidationFunctions = {
    [ValidationFunctionNames.required]: required,
    [ValidationFunctionNames.minLen]: minLen,
}

function required(value: any, configValue: boolean, fieldName: FieldName) {
    if (!value) {
        return { valid: false, message: `${fieldName} is required` }
    } else {
        return { valid: true }
    }
}

function minLen(value: any, configValue: number, fieldName: FieldName) {
    if (value.length < configValue) {
        return { valid: false, message: `${fieldName} needs to be atleast ${configValue} characters long` }
    } else {
        return { valid: true }
    }
}

export function validate(config: ConfigArray) {
    const errors: errorsObj = {}

    config.forEach((input: Config) => {

        Object.entries(input).forEach(entry => {
            const [key, value]: [string, any] = entry
            const functionKey = key as ValidationFunctionNames

            if (["field", "value"].includes(functionKey)) return

            const func: ValidationFunction = validationFunction[functionKey]

            const isValid: ValidationResponse = func(input.value, value, input.field)

            if (isValid.valid === false) {
                errors[input.field] = isValid.message!
            }
        })
    })
    return errors
}

export function hasErrors(errors: errorsObj) {
    if (Object.keys(errors).length > 0) {
        return true
    } else {
        return false
    }
}

const config: ConfigArray = [{
    field: "username",
    value: "john",
    required: true,
    minLen: 8
}]






