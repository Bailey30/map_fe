"use server"
import { MapState } from "@/redux/slice"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import prisma from "../lib/db"
import { auth } from "./auth"

const FromSchema = z.object({
    id: z.string(),
    location: z.string(),
    price: z.string(),
    rating: z.string(),
    comments: z.string(),
    latitude: z.number(),
    longitude: z.number()
})
const CreateReview = FromSchema.omit({ id: true })


export async function createReview(location: MapState, prevState: any, formData: FormData) {
    const { latitude, longitude } = location

    try {
        const data = CreateReview.parse({
            ...Object.fromEntries(formData), latitude, longitude
        })

        await axios.post(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string, JSON.stringify(data))
        revalidateTag("reviews")
        return {
            success: true,
            review: { ...formData, latitude, longitude }
        }
    } catch (error: any) {
        console.log("error creating review", error)
        return {
            success: false
        }
    } finally {
        redirect("/")
    }
}



export async function getUser() {

    const authData = await auth()
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

async function createLocation(coordinates:MapState, name: string) {
    try {
        const location = await prisma?.location.create({
            data: {
                name: name,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
        })
        return location
    } catch (error: any) {
        console.log("error creating location", error)
        throw new Error("error creating location", error)
    }
}

export async function createReviewSQL(coordinates: MapState, prevState: any, formData: FormData) {
    console.log("creating review with SQL")

    try {
        const { latitude, longitude } = coordinates

        const data = CreateReview.parse({
            ...Object.fromEntries(formData), latitude, longitude
        })

        const user = await getUser()

        const location = await createLocation(coordinates, data.location)

        const newReview = await prisma?.review.create({
            data: {
                locationId: location.id,
                creatorId: user.id,
                rating: parseInt(data.rating),
                price: parseFloat(data.price),
                comments: data.comments
            }
        })

        console.log({ newReview })

        revalidateTag("reviews")

        return {
            success: true,
            review: { ...formData, latitude, longitude }
        }
    } catch (error: any) {
        console.log("error creating review", error)
        return {
            success: false
        }
    } finally {
        redirect("/")
    }
}








