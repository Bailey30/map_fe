"use server"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import prisma from "../lib/db"
import { hasErrors, validate } from "@/utils/formValidator"
import { ReviewData, ServerActionResponse, Location, UpdateReviewData } from "@/utils/types"
import uploadImage from "./uploadImage"
import { getAuthenticatedUser } from "./user_repository"
import { createLocation, deleteLocation, getLocation } from "./location_repository"
import { createReview, deleteReview, getReviews, updateReview } from "./review_repository"
import { extractFormData } from "@/utils/formUtils"

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
        const data = extractFormData(formData)

        const errors = validate([
            {
                name: "price",
                value: data.price,
                required: {
                    is: true,
                    customResponse: "please add how much the guinness cost",
                },
            },
            {
                name: "rating",
                value: data.rating,
                required: true,
            },
            {
                name: data.id ? "id" : "location",
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
            const location = data.id ? await getLocation(data.id, tx) : await createLocation(reviewData?.mapState!, data.location, tx)
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
const response = ({ success, action, redirect, errors }: ServerActionResponse): ServerActionResponse => {
    return { success, action, redirect, errors }
}

export async function deleteReviewAction(reviewData: any, prevState: any, formState: FormData): Promise<ServerActionResponse> {
    try {
        await deleteReview(reviewData.reviewId)

        const reviews = await getReviews(reviewData.locationId)

        if (reviews?.length === 0) {
            await deleteLocation(reviewData.locationId)
            return response({
                success: true,
                action: "Successfully deleted last review and location",
                redirect: true,
                errors: null
            })
        }

        revalidateTag("reviews")
        return {
            success: true,
            action: "Successfully deleted review",
            errors: null
        }
    } catch (err: any) {
        console.log("error deleting review", err)
        return {
            success: false,
            errors: err
        }
    }
}

export async function updateReviewAction(reviewData: UpdateReviewData, prevState: any, formData: FormData): Promise<ServerActionResponse> {
    try {
        const data = extractFormData(formData)

        const updateData = {
            rating: parseInt(data.rating),
            price: parseFloat(data.price),
            comments: data.comments,
        }

        let key
        if (reviewData.imageData) {
            const imageId = data.imageId ? parseInt(data.imageId) : 0
            key = imageId + 1
            await uploadImage(reviewData.imageData, data.locationData, key)
            Object.assign(updateData, { imageId: key })
        }

        await updateReview(parseInt(data.reviewId), updateData)

        revalidateTag("reviews")

        return {
            success: true,
            errors: "",
            action: "update",
            body: {
                message: key ? "Updated review and image" : "Updated review"
            }
        }

    } catch (err: any) {
        console.log("error updating review", err)
        return {
            success: false,
            errors: err
        }
    }
}






