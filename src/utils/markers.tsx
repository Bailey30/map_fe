import { Marker } from "react-map-gl"
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
        console.log("res.data",res.data)
        return res.data.items
    } catch (err: any) {
        console.log(err)
    }
}


export default function useMarkers() {
    return useQuery({ queryKey: ["reviews"], queryFn: getMarkers })
}

export async function useNextCacheMarkers(){
    console.log("calling usenextcacheMarkers")
    const res = await fetch(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT, {next: {tags: ["reviews"]}})
    const data = await res.json()
    return data.items
}
