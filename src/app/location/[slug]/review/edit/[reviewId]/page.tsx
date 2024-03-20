import ReviewForm from "@/components/reviewForm/reviewForm"
import { getReview } from "@/lib/review_repository"
import { updateReviewAction } from "@/lib/server_actions"

export default async function EditPage({ params }: { params: { reviewId: string } }) {
    const review = await getReview(params.reviewId)
    console.log({ review })
    return (
        <ReviewForm locationId={review?.locationId} locationName={review?.location.name} actionFunction={updateReviewAction} action="edit" />
    )
}
