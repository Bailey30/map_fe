"use server"
import { MapState } from "@/redux/slice"
import axios from "axios"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import prisma from "../lib/db"
import { auth } from "./auth"
import { hasErrors, validate } from "@/utils/formValidator"

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

type FormState = {
    id?: string,
    location?: string,
    price: string,
    rating: string,
    comments: string,
    latitude: number,
    longitude: number
}


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

async function createLocation(coordinates: MapState, name: string) {
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

async function getLocation(id: string) {
    try {
        const location = await prisma?.location.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return location
    } catch (error: any) {
        console.log("error getting location", error)
        throw new Error("error creating location", error)
    }
}

export async function createReviewSQL(coordinates: MapState, prevState: any, formData: FormData) {
    console.log("creating review with SQL")
    console.log(formData)

    try {
        const { latitude, longitude } = coordinates

        const form = Object.fromEntries(formData)
        const data = Object.fromEntries(
            Object.entries(form).map(([key, value])=> [key, value as string])
        )

       

        const errors = validate([{
            field: "price",
            value: data.price ,
            required: true,
        }, {
            field: "rating",
            value: data.rating,
            required: true
        }, {
            field: data.id ? "id" : "location",
            value: data.id ? data.id  : data.location,
            required: true
        }])

        // Leave function if there are form errors
        if (hasErrors(errors)) {
            console.log("form errors", errors)
            return {
                success: "field errors",
                errors: errors
            }
        }

        const user = await getUser()

        const location = data.id ? await getLocation(data.id) : await createLocation(coordinates, data.location)
        if (!location) {
            throw new Error("error creating location")
        }

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
        // redirect("/")
    }
}








