"use server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { POST, signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { generatePassword, validateRegisterInputs } from "../utils/userUtils";
import { PasswordResetCodeResponse, ServerActionResponse } from "@/utils/types";
import { createUser, findUser, updatePassword } from "./user_repository";
import { extractFormData } from "@/utils/formUtils";

export async function register(
    prevData: any,
    formData: FormData,
): Promise<ServerActionResponse> {
    console.log("calling register");
    const { username, email, password } = Object.fromEntries(formData);

    let response: ServerActionResponse = { success: true, errors: null };

    try {
        const user = await findUser(
            String(email).toLowerCase(),
            String(username).toLowerCase(),
        );

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

        const errors = validateRegisterInputs(formData, user);
        if (errors.success === false) {
            console.log("there was errors", errors.errors);
            return {
                success: false,
                errors: errors.errors,
            };
        }

        const hashedPassword = await generatePassword(password as string);

        const newUser = await createUser({
            email: String(email).toLowerCase(),
            password: hashedPassword,
            username: String(username).toLowerCase(),
        });

        //immediately login
        console.log({ formData });

        // old way of logging in causing error now for some reason
        // await login("", formData);
        response["body"] = { user: newUser };
        response.body.user.password = password;

        return response;
    } catch (error: any) {
        console.log("error creating user", error);
        return {
            success: false,
            errors: error,
        };
    }
}

export async function login(prevState: any, formData: any) {
    const { email, password } = Object.fromEntries(formData);
    let err = null;
    try {
        const user = await signIn("credentials", {
            email: email.toLowerCase(),
            password,
            id: 2,
            // redirect: false
        });
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
        err = error;
        throw error;
    } finally {
        if (err == null) {
            redirect("/");
        }
    }
}

export async function logOut() {
    console.log("logging out");
    await signOut();
}

export async function sendPasswordResetEmail(
    prevState: any,
    formData: FormData,
): Promise<ServerActionResponse> {
    const { email } = Object.fromEntries(formData);

    if (!email) {
        return {
            success: false,
            errors: "No email entered",
        };
    }

    try {
        const user = await findUser(String(email), "");

        if (user) {
            await fetch(
                (process.env.NEXT_PUBLIC_GUINNESS_MAP_SERVICES_URL as string) +
                "/sendemail",
                {
                    method: "POST",
                    body: JSON.stringify({ email: String(email), userId: user.id }),
                },
            );
        }

        // it will return success regardless of whether there is a user or not
        return {
            success: true,
            errors: null,
        };
    } catch (err: any) {
        console.log("error sending password email", err);
        return {
            success: false,
            errors: err,
        };
    }
}

export async function resetPassword(
    extraData: any,
    prevState: any,
    formData: FormData,
): Promise<ServerActionResponse> {
    const { password } = extractFormData(formData);

    try {
        const res: PasswordResetCodeResponse = await fetch(
            (process.env.NEXT_PUBLIC_GUINNESS_MAP_SERVICES_URL as string) +
            "/validatetoken",
            {
                method: "POST",
                body: JSON.stringify({ token: extraData.code }),
            },
        ).then(async (res) => {
            return await res.json();
        });

        console.log({ res });

        if (res.success === true) {
            console.log("success was true");
            // reset the password
            const hashedPassword = await generatePassword(password);
            await updatePassword(hashedPassword, res.userId);
        } else {
            console.log("res was not success");
            return {
                success: false,
                errors: "Error validating token. Request new email.",
            };
        }

        return {
            success: true,
            errors: null,
        };
    } catch (err: any) {
        return {
            success: false,
            errors: err.message,
        };
    }
}
