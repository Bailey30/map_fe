"use server"
import { redirect } from "next/navigation";
import prisma from "../lib/db"
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth"
import { generatePassword, validateRegisterInputs } from "@/utils/userUtils";
import { InputErrors } from "@/utils/types";


export async function register(prevData: any, formData: FormData) {
    console.log("calling register")
    const { username, email, password } = Object.fromEntries(formData)

    let errors: InputErrors = {}

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: String(email).toLowerCase(),
                    },
                    {
                        username: String(username).toLowerCase()
                    }
                ]
            }
        })

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
        if (Object.keys(errors).length > 0) {
            return errors
        }
       
        const hashedPassword = await generatePassword(password as string)

        await prisma.user.create({
            data: {
                email: String(email).toLowerCase(),
                password: hashedPassword,
                username: String(username).toLowerCase()
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




