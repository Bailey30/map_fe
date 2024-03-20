import ReviewForm from "@/components/reviewForm/reviewForm"
import { createReviewSQL } from "@/lib/server_actions"

export default function Page({ params, searchParams }: {
    params: { slug: string }
    searchParams: { [key: string]: string }
}) {
    console.log({ searchParams })
    return <>
        <ReviewForm locationId={params.slug} locationName={searchParams.location} actionFunction={createReviewSQL} action="add" />
    </>
}
