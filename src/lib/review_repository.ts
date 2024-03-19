import { Location, User } from "@/utils/types";
import { Review } from "@prisma/client";

export async function createReview(location: Location, user: User, data: any, tx: any): Promise<Review> {
    try {
        const newReview = await tx?.review.create({
            data: {
                locationId: location.id,
                creatorId: user.id,
                rating: parseInt(data.rating),
                price: parseFloat(data.price),
                comments: data.comments,
            }
        })
        return newReview
    } catch (err: any) {
        console.log("error creating review", err)
        throw new Error("error creating review", err)
    }
}

export async function deleteReview(reviewId: number) {
    try {
        const deletedReview = await prisma?.review.delete({
            where: {
                id: reviewId
            }
        })
        return deletedReview
    } catch (err: any) {
        throw new Error("error creating review", err)
    }
}

export async function getReviews(locationId: number): Promise<Review[] | undefined> {
    try {
        const reviews = await prisma?.review.findMany({
            where: {
                locationId: locationId
            }
        })
        return reviews
    } catch (err: any) {
        throw new Error("error getting reviews from location", err)
    }
}
