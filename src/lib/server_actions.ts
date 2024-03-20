"use server"
import { MapState } from "@/redux/slice"
import axios from "axios"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import prisma from "../lib/db"
import { auth } from "./auth"
import { hasErrors, validate } from "@/utils/formValidator"
import { ReviewData, ServerActionResponse, Location } from "@/utils/types"
import uploadImage from "./uploadImage"
import { getAuthenticatedUser } from "./user_repository"
import { createLocation, deleteLocation, getLocation } from "./location_repository"
import { createReview, deleteReview, getReviews } from "./review_repository"

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



// export async function createReview(location: MapState, prevState: any, formData: FormData) {
//     const { latitude, longitude } = location
//
//     try {
//         const data = CreateReview.parse({
//             ...Object.fromEntries(formData), latitude, longitude
//         })
//
//         await axios.post(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string, JSON.stringify(data))
//         revalidateTag("reviews")
//         return {
//             success: true,
//             review: { ...formData, latitude, longitude }
//         }
//     } catch (error: any) {
//         console.log("error creating review", error)
//         return {
//             success: false
//         }
//     } finally {
//         redirect("/")
//     }
// }


// Creates reviews on locations that already exist and create locations when they dont
export async function createReviewSQL(reviewData: ReviewData, prevState: any, formData: FormData): Promise<ServerActionResponse> {
    console.log("creating review with SQL")
    console.log(formData)

    try {
        const form = Object.fromEntries(formData)
        const data = Object.fromEntries(
            Object.entries(form).map(([key, value]) => [key, value as string])
        )

        const errors = validate([
            {
                field: "price",
                value: data.price,
                required: {
                    is: true,
                    customResponse: "please add how much the guinness cost",
                },
            },
            {
                field: "rating",
                value: data.rating,
                required: true,
            },
            {
                field: data.id ? "id" : "location",
                value: data.id ? data.id : data.location,
                required: true,
                minLen: {
                    is: data.id ? 0 : 3,
                    customResponse: "atleast 3",
                },
                maxLen: 30,
            },
        ]);

        // Leave function if there are form errors
        if (hasErrors(errors)) {
            console.log("form errors", errors)
            return {
                success: false,
                errors: errors
            }
        }

        const user = await getAuthenticatedUser()

        const location = await prisma.$transaction(async (tx) => {
            const location = data.id ? await getLocation(data.id, tx) : await createLocation(reviewData.mapState, data.location, tx)
            if (!location) {
                throw new Error("error creating location")
            }

            const newReview = await createReview(location, user, data, tx)

            // extract function
            if (reviewData.imageData) {
                console.log("updating with image id")
                const key = newReview.id
                await uploadImage(reviewData.imageData, location.name, key)

                await tx?.review.update({
                    where: {
                        id: newReview.id
                    },
                    data: {
                        imageId: newReview.id
                    }
                })
            } else {
                console.log("no image id")
            }

            return location
        })

        revalidateTag("reviews")

        return {
            success: true,
            errors: null,
            action: data.id ? `Review added to location: ${location.name}.` : `New location ${location.name} added with review.`
        }

    } catch (error: any) {
        console.log("error creating review", error)
        return {
            success: false,
            errors: error
        }
    } finally {
        // redirect("/")
    }
}

export async function deleteReviewAction(reviewData: any, prevState: any, formState: FormData) {

    try {
        await deleteReview(reviewData.reviewId)

        const reviews = await getReviews(reviewData.locationId)

        if (reviews?.length === 0) {
            await deleteLocation(reviewData.locationId)
            return {
                success: true,
                action: "Successfully deleted last review and location",
                redirect: true
            }
        }

        revalidateTag("reviews")
        return {
            success: true,
            action: "Successfully deleted review"
        }
    } catch (err: any) {
        console.log("error deleting review", err)
        return {
            success: false,
            error: err
        }
    }
}

export async function updateReviewAction(reviewData: ReviewData, prevState: any, formData: FormData): Promise<ServerActionResponse> {

    return {
        success: true,
        errors: ""
    }
}






