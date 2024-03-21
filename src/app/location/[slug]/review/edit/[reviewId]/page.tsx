import ReviewForm from "@/components/reviewForm/reviewForm"
import { getReview } from "@/lib/review_repository"
import { updateReviewAction } from "@/lib/server_actions"

export default async function EditPage({ params }: { params: { reviewId: string } }) {
    console.log("edit oage")
    const review = await getReview(params.reviewId)
    return (
        <ReviewForm locationId={review?.locationId} locationName={review?.location.name} action="edit" review={review} />
    )
}
