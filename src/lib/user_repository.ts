import { NewUser, User } from "@/utils/types";
import prisma from "../lib/db"
import { auth } from "./auth";

export async function createUser(newUser: NewUser): Promise<User> {
    console.log({ newUser })
    // console.log({ prisma })
    try {
        const user = await prisma.user.create({
            data: {
                email: newUser.email,
                password: newUser.password,
                username: newUser.username
            }
        })
        // const user = { id: 1, username: "ef", email: "dfds", password: "esfds" }
        console.log("created user", user)
        return user
    } catch (err: any) {
        throw new Error("error creating new user", err)
    }
}

export async function findUser(email: string, username: string): Promise<User | null> {
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
        return user
    } catch (err: any) {
        throw new Error("error finding user", err)
    }
}

// maybe return error?
// maybe prisma.user.findUniqueOrThrow()?
export async function getAuthenticatedUser(): Promise<User> {
    const authData = await auth()
    console.log({ authData })
    if (!authData || !authData.user?.email) {
        throw new Error('Authentication data is missing or invalid.');
    }

    const user = await prisma.user.findFirst({
        where: {
            email: authData.user.email
        }
    })

    if (!user) {
        throw new Error('User not found.');
    }

    return user
}
