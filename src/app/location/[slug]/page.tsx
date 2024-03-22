import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import { auth } from "@/lib/auth"
import { Location, LocationData } from "@/utils/types"
import { getImages, getReviews } from "@/lib/data"



export default async function LocationPage({ params }: { params: { slug: string } }) {
    const locationId = params.slug
    const session = await auth()

    // gets the location with all its reviews
    const location: Location = await getReviews(locationId)
    const images = await getImages(location)

    const locationData: LocationData = {
        ...location, images
    }

    console.log(location.Review)

    return (
        <ReviewsDisplay locationData={locationData} session={session} />
    )
}
