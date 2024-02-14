"use server"
import { redirect } from "next/navigation";
import prisma from "../lib/db"
import bcrypt from "bcrypt"
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth"

export async function validateRegisterInputs(formData: FormData) {
    const errors: any = {}
    const { email, password, passwordRepeat } = Object.fromEntries(formData)

    if (password !== passwordRepeat) {
        errors["password"] = "password does not match";
    }
    if (!email) {
        errors["email"] = "email is required";
    }
    if (!password) {
        errors["password"] = "password is required";
    }
    return errors;
}



export async function register(prevData: any, formData: FormData) {
    console.log("calling register")
    const { email, password } = Object.fromEntries(formData)

    const errors: any = await validateRegisterInputs(formData)

    if (Object.keys(errors).length > 0) {
        return errors
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: String(email)
            }
        })

        if (user) {
            console.log("email already exists")
            errors["email"] = "email already exists"
            return errors
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password as string, salt)

        await prisma.user.create({
            data: {
                email: email as string,
                password: hashedPassword
            }
        })

        //immediately login
        await login(prevData, formData)

    } catch (error: any) {
        console.log("error creating user", error)
    } finally {
        if (Object.keys(errors).length === 0) {
            redirect("/")
        }
    }
}

export async function login(prevState: any, formData: any) {
    const { email, password } = Object.fromEntries(formData)

    try {
        const user = await signIn("credentials", {
            email,
            password,
            // redirect: false
        })
    } catch (error: any) {
        if (error instanceof AuthError) {
            console.log("loginfunction error", error);
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function logOut() {
    console.log("logging out")
        await signOut()
}




