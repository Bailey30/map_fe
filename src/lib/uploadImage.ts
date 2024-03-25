import formatLocationName from "@/utils/formatLocationName"
import { blobify } from "@/utils/reviewUtils"
import axios from "axios"
import { revalidateTag } from "next/cache"


export default async function uploadImage(imageData: string, location: string, key: number): Promise<void> {
    try {
        const filename = formatLocationName(location) + "/" + key + ".jpeg"
        const blob = await blobify(imageData)
        // const signedUrl = await axios.post(process.env.NEXT_PUBLIC_IMAGE_URL_ENDPOINT as string, JSON.stringify({ key: filename }))

        // get signed url
        const signedUrlResponse = await fetch(process.env.NEXT_PUBLIC_IMAGE_URL_ENDPOINT as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: filename })
        });

        const signedUrl = await signedUrlResponse.json();

        // upload image to S3 using signed url
        const result = await fetch(signedUrl.uploadURL, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": "image/jpeg"
            }
        })
        console.log("upload image result", result.body)
        revalidateTag("images")
    } catch (err: any) {
        console.log("error uploading image", err)
        throw new Error("error uploading image", err)
    }
}
