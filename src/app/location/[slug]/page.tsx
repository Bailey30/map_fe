import ReviewsDisplay from "@/components/reviewsDisplay/reviewsDisplay"
import { auth } from "@/lib/auth"
import { Location, LocationData } from "@/utils/types"
import { getImages, getReviews } from "@/lib/data"



export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    const locationId = params.slug
    const session = await auth()
    // const session = null
    const location: Location = await getReviews(locationId)
    // const location = {}
    // const location = {
    //     name: "",
    //     id: 0,
    //     latitude: 0,
    //     longitude: 0,
    //     Review: null
    // }
    // const images = await getImages(location)
    const images = {}
    // console.log({ images })

    const locationData: LocationData = {
        ...location, images
    }

    return (<>
        <ReviewsDisplay locationData={locationData} session={session} />
    </>
    )
}
