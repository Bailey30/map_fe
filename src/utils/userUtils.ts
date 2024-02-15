import { User } from "@prisma/client";
import bcrypt from "bcrypt"
import { InputErrors } from "./types";

export async function validateRegisterInputs(formData: FormData, user: User | null) {
    let errors: InputErrors = {}
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
    if (user?.email === email) {
        console.log("email already exists")
        errors["email"] = "email already exists"
    }
    if (user?.username === username) {
        console.log("username already exists")
        errors["username"] = "username  already exists"
    }
    return errors;
}


export async function generatePassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password as string, salt)
    return hashedPassword
}
