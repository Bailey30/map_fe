"use client"
import { useFormState, useFormStatus } from "react-dom";
import styles from "./review.module.css"
import { createReview, createReviewSQL } from "@/lib/server_actions";
import { useAppSelector } from "@/redux/hooks";

export default function CreateReviewPanel() {
    const location = useAppSelector((state) => state.map)
    const createReviewWithLocation = createReviewSQL.bind(null, location)
    const { pending, data } = useFormStatus();
    const [message, formAction] = useFormState(createReviewWithLocation, null)

    return (
        <div className={styles.infoPanel}>
            <form action={formAction}>

                <label htmlFor="location">Location</label>
                <input name="location"></input>
                <label htmlFor="price">price</label>
                <input name="price" type="number"></input>
                <label htmlFor="rating">rating</label>
                <input name="rating" type="number" />
                <label htmlFor="comments">comments</label>
                <input type="text" name="comments" />
                <div className={styles.buttonContainer}>

                    <button className={styles.save} type="submit">Save</button>
                    <button className={styles.cancel}>Cancel</button>
                </div>
                {message?.success === false && <div>An error occured</div>}
            </form>
        </div>
    )
}
