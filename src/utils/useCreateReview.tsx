import { createReviewSQL } from "@/lib/server_actions";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function UseCreateReview() {
    const location = useAppSelector((state) => state.map)
    const [imageData, setImageData] = useState<string>("")
    const reviewData = {
        mapState: location,
        imageData,
    }
    const createReviewWithLocation = createReviewSQL.bind(null, reviewData)
    const [message, formAction] = useFormState(createReviewWithLocation, null)

    return { setImageData, message, formAction }

}
