import { createReviewSQL } from "@/lib/server_actions";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SpecIterable } from "undici";
import { ServerAction, ServerActionResponse } from "./types";


interface Props {
    action: any
}
export default function UseCreateReview(action: ServerAction) {
    const location = useAppSelector((state) => state.map)
    const [imageData, setImageData] = useState<string>("")
    const reviewData = {
        mapState: location,
        imageData,
    }
    const actionAndData = action.bind(null, reviewData)
    const [message, formAction]: [state: ServerActionResponse | null, dispatch: (payload: any) => void] = useFormState(actionAndData, null)

    return { imageData, setImageData, message, formAction }

}
