import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import styles from "../review.module.scss"
import { auth } from "@/lib/auth"
import ScrollContainer from "@/components/scrollContainer/scrollContainer"
import { Location, LocationData } from "@/utils/types"
import formatLocationName from "@/utils/formatLocationName"
import { cache } from "react"


async function getReviews(id: string): Promise<Location> {
    console.log("calling get reviews")
    return await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/review/" + id)
        .then((res) => { // will it find newly added reviews or only get ones from the cache?
            return res.json()
        })
        .then((json) => {
            return json.location
        })
}

async function getImages(location: Location) {
    return await fetch(process.env.NEXT_PUBLIC_GET_IMAGES_URL_ENDPOINT as string, {
        cache: "force-cache",
        next: { tags: ["images"], revalidate: 3600 },
        method: "POST", body: JSON.stringify({ location: formatLocationName(location.name) },)
    }).then((res) => {
        return res.json()
    }).then((json) => {
        return json.images
    })
}

export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    const locationId = params.slug
    const session = await auth()
    const location: Location = await getReviews(locationId)
    const images = await getImages(location)
    console.log({ images })

    const locationData: LocationData = {
        ...location, images
    }

    return (
        <ScrollContainer>
            <div className={styles.infoPanel} id="info">
                <div className={styles.dragHandle}></div>
                <ReviewsDisplay locationData={locationData} session={session} />
            </div>
        </ScrollContainer>
    )
}
