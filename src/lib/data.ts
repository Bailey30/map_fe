import { Location } from "@/utils/types"
import formatLocationName from "@/utils/formatLocationName"

export async function getReviews(id: string): Promise<Location> {
    console.log("calling get reviews")
    return await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/review/" + id)
        .then((res) => { // will it find newly added reviews or only get ones from the cache?
            return res.json()
        })
        .then((json) => {
            return json.location
        })
}

export async function getImages(location: Location) {
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
