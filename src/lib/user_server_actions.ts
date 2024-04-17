"use server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { generatePassword, validateRegisterInputs } from "../utils/userUtils";
import { ServerActionResponse } from "@/utils/types";
import { createUser, findUser } from "./user_repository";

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
    await login(prevData, formData);
    response["body"] = { user: newUser };
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
    throw error;
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

  const user = await findUser(String(email), "");
  console.log({ email });

  if (user) {
    const res = await fetch("http://localhost:3001/sendemail", {
      method: "POST",
      body: JSON.stringify({ email: String(email), userId: user.id }),
    });
    console.log({ res });
  }

  return {
    success: true,
    errors: null,
  };
}
