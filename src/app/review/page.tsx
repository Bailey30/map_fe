"use client"
import { useFormState, useFormStatus } from "react-dom";
import styles from "./review.module.css"
import { createReviewSQL } from "@/lib/server_actions";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import ReviewImageCreator from "@/components/reviewImage/reviewImageCreator";
import UseCreateReview from "@/utils/useCreateReview";

export default function CreateReviewPanel() {
    const router = useRouter()
    const { setImageData, message, formAction } = UseCreateReview()
    // const location = useAppSelector((state) => state.map)
    // const reviewData = {
    // mapState: location
    // }
    // const createReviewWithLocation = createReviewSQL.bind(null, reviewData)
    // const [message, formAction] = useFormState(createReviewWithLocation, null)

    function back() {
        router.push("/")
    }

    return (
        <div className={styles.infoPanel}>
            {message?.success !== true ?
                <form action={formAction}>
                    <ReviewImageCreator setImageData={setImageData} />
                    <label htmlFor="location">Location</label>
                    <input name="location"></input>
                    {message?.errors?.location && <div>{message?.errors?.location}</div>}
                    <label htmlFor="price">price</label>
                    <input name="price" type="number"></input>
                    {message?.errors?.price && <div>{message?.errors?.price}</div>}
                    <label htmlFor="rating">rating</label>
                    <input name="rating" type="number" />
                    {message?.errors?.rating && <div>{message?.errors?.rating}</div>}
                    <label htmlFor="comments">comments</label>
                    <input type="text" name="comments" />

                    <div className={styles.buttonContainer}>
                        <button className={styles.save} type="submit">Save</button>
                        <button className={styles.cancel} onClick={back}>Cancel</button>
                    </div>
                    <Pending />
                    {message?.success === false && <div>An error occured</div>}
                </form>
                :
                <div>

                    <div>Guinness successfully added</div>
                    <button onClick={back}>Back</button>
                </div>
            }
        </div>
    )
}
