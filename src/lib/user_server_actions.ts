"use server"
import { redirect } from "next/navigation";
import prisma from "../lib/db"
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth"
import { generatePassword, validateRegisterInputs } from "@/utils/userUtils";
import { InputErrors } from "@/utils/types";
import { createUser, findUser } from "./user_service";


export async function register(prevData: any, formData: FormData) {
    console.log("calling register")
    const { username, email, password } = Object.fromEntries(formData)

    let errors: InputErrors = { success: true }

    try {
        const user = await findUser(String(email).toLowerCase(), String(username).toLowerCase())


        // const errors = validate([
        //     {
        //         field: "username",
        //         value: username as string,
        //         required: true,
        //         isEqual: {
        //         for:    user?.username,
        //             customResponse: ""
        //         }
        //
        //     }
        // ]

        errors = await validateRegisterInputs(formData, user)
        if (errors.success === false) {
            console.log({ errors })
            return errors
        }

        const hashedPassword = await generatePassword(password as string)

        await createUser({
            email: String(email).toLowerCase(),
            password: hashedPassword,
            username: String(username).toLowerCase()
        })

        //immediately login
        await login(prevData, formData)

        return {
            success: true
        }

    } catch (error: any) {
        console.log("error creating user", error)
    } finally {
        if (errors.success === true) {
            redirect("/")
        }
    }
}

export async function login(prevState: any, formData: any) {
    const { email, password } = Object.fromEntries(formData)

    try {
        const user = await signIn("credentials", {
            email: email.toLowerCase(),
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




