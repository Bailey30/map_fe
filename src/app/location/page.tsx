"use client"
import styles from "./review.module.scss"
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import ReviewImageCreator from "@/components/reviewImage/reviewImageCreator";
import UseCreateReview from "@/utils/useCreateReview";
import clsx from "clsx";
import StarRating from "@/components/starRating/starRating";
import { useEffect, useState } from "react";

export default function CreateReviewPanel() {
    const router = useRouter()
    const { setImageData, message, formAction } = UseCreateReview()
    const [ratingInput, setRatingInput] = useState<number>(1)

    function back() {
        router.push("/")
    }

    useEffect(() => {
        if (message?.success === true) {
            router.push("/location/success")
        }
    }, [message])

    return (

        <>
            <form action={formAction} className={styles.form}>
                <div className={styles.imageAndInputsContainer}>
                    <ReviewImageCreator setImageData={setImageData} />
                    <div className={styles.inputsContainer}>
                        <label htmlFor="location" className={styles.label}>Location</label>
                        <input name="location" className={styles.input} aria-required="true"></input>
                        {message?.errors?.location && <div>{message?.errors?.location}</div>}
                        <label htmlFor="price" className={styles.label}>Price</label>
                        <input name="price" type="number" className={styles.input} aria-required="true"></input>
                        {message?.errors?.price && <div>{message?.errors?.price}</div>}
                        <div className={styles.rating}>
                            <label htmlFor="rating" className={clsx(styles.label, styles.hidden)} aria-required="true">Rating</label>
                            <input name="rating" type="number" className={clsx(styles.input, styles.hidden)} value={ratingInput} />
                            <StarRating setRatingInput={setRatingInput} />
                        </div>
                        {message?.errors?.rating && <div>{message?.errors?.rating}</div>}
                    </div>
                </div>
                <label htmlFor="comments" className={clsx(styles.label, styles.comment)}>Comments - optional</label>
                <textarea name="comments" className={clsx(styles.input, styles.comment)} />

                <div className={styles.buttonContainer}>
                    <button className={styles.save} type="submit">Save</button>
                    <button className={styles.cancel} onClick={back}>Cancel</button>
                </div>

                <Pending />
                {message?.success === false && <div>An error occured</div>}
            </form>

        </>
    )
}
