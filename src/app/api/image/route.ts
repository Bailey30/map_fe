
import getImage from "@/lib/getImage"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
    console.log("GET IMAGE ROUTE HANDLER")
    const searchParams = request.nextUrl.searchParams
    console.log({searchParams})
    const locationId = searchParams.get("location")
    const reviewId = searchParams.get("review")
    console.log({reviewId})
    try {
        const key = reviewId + ".jpeg"
        const signedUrl = await fetch(process.env.NEXT_PUBLIC_GET_IMAGE_URL_ENDPOINT  as string, {
            method: "POST",
            body: JSON.stringify({key: key})
        })
        const data = await signedUrl.json()
        const imageData = await fetch(data.uploadURL, {
            method: "GET"
        })
        return NextResponse.json({ status: 200, image: data.uploadURL})
    } catch (err: any) {
        console.log("error getting image", err)
        return NextResponse.json({ status: 500, message: err })
    }
} 
