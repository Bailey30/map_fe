"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "../../app/location/review.module.scss"
import UseCreateReview from "@/utils/useCreateReview"
import clsx from "clsx"
import ReviewImageCreator from "../reviewImage/reviewImageCreator"
import Pending from "../pending/pending"
import StarRating from "../starRating/starRating"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isPriceRegex } from "@/utils/formValidator"
import UseFormyBoi from "@/utils/useFormyBoi"
import { Review, ServerActionResponse } from "@/utils/types"
import { formatBase64String } from "@/utils/reviewUtils"
import { useAppSelector } from "@/redux/hooks"
import { createReviewSQL, updateReviewAction } from "@/lib/server_actions"

interface ReviewFormProps {
    locationId: string,
    locationName: string
    action: "edit" | "add"
    review?: Review
}

export default function ReviewForm({ locationId, locationName, review, action }: ReviewFormProps) {
    const router = useRouter()
    const { setImageData, message, formAction } = UseCreateReview(action === "edit" ? updateReviewAction : createReviewSQL)
    const [ratingInput, setRatingInput] = useState<number>(review?.rating ?? 1)
    const imgString = useAppSelector((state) => state.review.imgString)

    const { values, setValue, errors, validators } = UseFormyBoi([
        { name: "location", value: "", minLen: { is: 3 } },
        { name: "price", value: review?.price.toString() ?? "", required: true, isPriceRegex: true },
        { name: "comments", minLen: 140, value: review?.comments ?? "" }])

    useEffect(() => {
        if (message?.success === true) {
            router.push("/location/success")
        }
    }, [message])

    return (
        < >
            {message?.success !== true &&
                <form action={formAction} className={styles.form}>
                    <input name="id" className={clsx(styles.hidden)} value={locationId} readOnly></input>
                    <input name="reviewId" className={clsx(styles.hidden)} value={review?.id ?? undefined} readOnly></input>

                    <div className={styles.imageAndInputsContainer}>
                        <ReviewImageCreator setImageData={setImageData} imgString={action === "edit" ? imgString : ""} />

                        <div className={styles.inputsContainer}>
                            <label htmlFor="locationData" className={clsx(styles.label)}>Location</label>
                            <input name="locationData" className={clsx(styles.input)} value={locationName} readOnly />

                            <label htmlFor="price" className={styles.label}>Price</label>
                            <div className={clsx(styles.input, styles.priceContainer)}>
                                <span className={clsx(styles.poundSign)}>£</span>
                                <input name="price" type="text" className={clsx(styles.input, styles.price, styles.pricee)} aria-required="true" value={values.price} onChange={setValue}></input>
                            </div>
                            {message?.errors?.price && <p className={styles.errorMessage}>{message?.errors?.price}</p>}

                            <div className={styles.rating}>
                                <label htmlFor="rating" className={clsx(styles.label, styles.hidden)} aria-required="true">Rating</label>
                                <input name="rating" type="number" className={clsx(styles.input, styles.hidden)} value={ratingInput} />
                                <StarRating setRatingInput={setRatingInput} />
                            </div>

                        </div>
                    </div>

                    <label htmlFor="comments" className={clsx(styles.label, styles.comment)}>Comments - optional</label>
                    <textarea name="comments" className={clsx(styles.input, styles.comment)} value={values.comments} onBlur={validators} onChange={setValue} />

                    <div className={styles.buttonContainer}>
                        <button className={clsx(styles.button, styles.save)} type="submit">Save</button>
                        <Link className={clsx(styles.button, styles.cancel)} href={`/location/${locationId}`}>Cancel</Link>
                    </div>
                    <Pending />
                    {message?.success === false && <p className={styles.errorMessage}>An error occured</p>}
                </form>
            }
        </>
    )
}
