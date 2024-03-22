import formatLocationName from "@/utils/formatLocationName"
import axios from "axios"
import { revalidateTag } from "next/cache"

export async function blobify(data: string) {
    try {
        const blob = await fetch(data).then(res => res.blob())
        return blob
    } catch (err: any) {
        console.log("error turning image data into a blob", err)
        throw new Error("error turning image data into a blob", err)
    }
}

export default async function uploadImage(imageData: string, location: string, key: number) {
    try {
        const filename = formatLocationName(location) + "/" + key + ".jpeg"
        console.log({ filename })
        const blob = await blobify(imageData)
        const signedUrl = await axios.post(process.env.NEXT_PUBLIC_IMAGE_URL_ENDPOINT as string, JSON.stringify({ key: filename }))
        const result = await fetch(signedUrl.data.uploadURL, {
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
