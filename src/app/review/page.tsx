"use client"
import { useFormState, useFormStatus } from "react-dom";
import styles from "./review.module.css"
import { createReviewSQL } from "@/lib/server_actions";
import { useAppSelector } from "@/redux/hooks";

export default function CreateReviewPanel() {
    const location = useAppSelector((state) => state.map)
    const createReviewWithLocation = createReviewSQL.bind(null, location)
    const { pending, data } = useFormStatus();
    const [message, formAction] = useFormState(createReviewWithLocation, null)
    return (
        <div className={styles.infoPanel}>
            {message?.success !== true ?
                <form action={formAction}>
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
                        <button className={styles.cancel}>Cancel</button>
                    </div>

                    {pending && <p>creating review...</p>}
                    {message?.success === false && <div>An error occured</div>}
                </form>
                :
                <div>Guinness successfully added</div>
            }
        </div>
    )
}
