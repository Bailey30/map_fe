import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import styles from "../review.module.scss"
import { auth } from "@/lib/auth"
import ScrollContainer from "@/components/scrollContainer/scrollContainer"
import { Location, LocationData } from "@/utils/types"
import formatLocationName from "@/utils/formatLocationName"
import { cache } from "react"
import { getImages, getReviews } from "@/lib/data"



export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    const locationId = params.slug
    const session = await auth()
    const location: Location = await getReviews(locationId)
    const images = await getImages(location)
    console.log({ images })

    const locationData: LocationData = {
        ...location, images
    }

    return (<>
        <ReviewsDisplay locationData={locationData} session={session} />
    </>
    )
}
