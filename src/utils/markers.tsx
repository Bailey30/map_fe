import { Marker } from "react-map-gl"
import primsa from "@/lib/db"
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";

import "mapbox-gl/dist/mapbox-gl.css";
import axios, { AxiosResponse } from "axios";

type review = {
    id: number,
    latitude: number,
    longitude: number
}

export async function getMarkers() {
    try {
        console.log(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string)
        const res: AxiosResponse = await axios.get(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string)
        console.log("res.data", res.data)
        return res.data.items
    } catch (err: any) {
        console.log(err)
    }
}


export default function useMarkers() {
    return useQuery({ queryKey: ["reviews"], queryFn: getMarkers })
}

// export async function useNextCacheMarkers(){
//     console.log("calling usenextcacheMarkers")
//     const res = await fetch(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT, {next: {tags: ["reviews"]}})
//     // change to get locations directly from db??
//     const data = await res.json()
//     console.log("test")
//     console.log("test")
//     return data.items
// }


export async function useNextCacheMarkers() {
    console.log("calling useNextCacheMarkers")
    try {
        // call route handler so you can cache the data
        return await fetch("http://localhost:3000/api/review", { next: { tags: ["reviews"] } })
            .then(async (response) => {
                if (!response.ok) {
                    return new Error("Failed to fetch data")

                }
                return await response.json()
            })
            .then((json) => {
                json.reviews.forEach((rev: any) => {
                    console.log(rev.name)
                    console.log(rev.Review)
                })
                return json.reviews
            })
    } catch (error: any) {
        console.log("error getting reviews", error)
    }
}
