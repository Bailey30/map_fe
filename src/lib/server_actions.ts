"use server"
import { MapState } from "@/redux/slice"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import prisma from "../lib/db"

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



export async function createUser() {

}

async function createLocation(coordinates, name) {
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
    const { latitude, longitude } = coordinates

    try {
        const data = CreateReview.parse({
            ...Object.fromEntries(formData), latitude, longitude
        })

        const location = await createLocation(coordinates, data.location)
        await prisma?.review.create({
            data: {
                locationId: location!.id,
                creatorId: 2, // come back to this after creating user login
                rating: parseInt(data.rating),
                price: parseFloat(data.price),
                comments: data.comments
            }
        })

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








