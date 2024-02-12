"use server"
import { MapState } from "@/redux/slice"
import {  useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

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

async function postFormData(formData: FormData) {
    return await axios.post(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string, formData)
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
