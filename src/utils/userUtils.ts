import { User } from "@prisma/client";
import bcrypt from "bcrypt"
import { ServerActionResponse } from "./types";

export function validateRegisterInputs(formData: FormData, user: User | null) {
    // let errors: InputErrors = { success: false }
    let errors: any = {}
    const { username, email, password, passwordRepeat } = Object.fromEntries(formData)

    if (password !== passwordRepeat) {
        errors["password"] = "password does not match";
    }
    if (!username) {
        errors["username"] = "username is required"
    }
    if (!email) {
        errors["email"] = "email is required";
    }
    if (!password) {
        errors["password"] = "password is required";
    }
    if (user && user?.email === email) {
        console.log("email already exists")
        errors["email"] = "email already exists"
    }
    if (user && user?.username === username) {
        console.log("username already exists")
        errors["username"] = "username already exists"
    }
    console.log({ errors })

    if (Object.keys(errors).length > 0) {
        return {
            errors: errors,
            success: false
        }
    } else {
        return { success: true, errors: null }
    }
}



export async function generatePassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password as string, salt)
    return hashedPassword
}
