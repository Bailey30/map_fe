import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import styles from "../review.module.scss"
import { auth } from "@/lib/auth"
import ScrollContainer from "@/components/scrollContainer/scrollContainer"


async function getReviews(id: string) {
    console.log("calling get reviews")
    return await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/review/" + id)
        .then((res) => { // will it find newly added reviews or only get ones from the cache?
            return res.json()
        })
        .then((json) => {
            return json.location
        })
}

export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    const locationId = params.slug
    const session = await auth()
    const location = await getReviews(locationId)
    return (
        <ScrollContainer>
            <div className={styles.infoPanel} id="info">
                <div className={styles.dragHandle}></div>
                <ReviewsDisplay location={location} session={session} />
            </div>
        </ScrollContainer>
    )
}
