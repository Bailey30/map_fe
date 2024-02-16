import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import styles from "../review.module.css"


async function getReviews(id: string) {
    console.log("calling get reviews")
    return await fetch("http://localhost:3000/api/review/" + id)
        .then((res) => { // will it find newly added reviews or only get ones from the cache?
            return res.json()
        })
        .then((json) => {
            return json.location
        })
}

export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    console.log("get reivew panale", { params })
    const locationId = params.slug
    const location = await getReviews(locationId)
    console.log({location})
    return (
        <div className={styles.infoPanel}>
            <h2>{location.name}</h2>
<ReviewsDisplay reviews={location.Review}/>
        </div>
    )
}
