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

interface ReviewFormProps {
    locationId: string,
    locationName: string
    action: "edit" | "add"
    actionFunction: (...args: any) => Promise<ServerActionResponse>
    review?: Review
}

export default function ReviewForm({ locationId, locationName, review, action }: ReviewFormProps) {
    const router = useRouter()
    const { setImageData, message, formAction } = UseCreateReview(action)
    const [ratingInput, setRatingInput] = useState<number>(review?.rating ?? 1)
    const [price, setPrice] = useState<string>(review?.price.toString() ?? "")
    const imgString = useAppSelector((state) => state.review.imgString)

    const [values, setState, validators] = UseFormyBoi([{ field: "location", value: "sd", minLen: { is: 3 } }, { field: "price", value: "3", required: true }, { field: "comments", minLen: 3, value: "" }])

    useEffect(() => {
        if (message?.success === true) {
            router.push("/location/success")
        }
    }, [message])

    function validateNumber(e: any) {
        isPriceRegex(e.target.value) && setPrice(e.target.value)
    }

    return (
        < >
            {message?.success !== true &&
                <form action={formAction} className={styles.form}>
                    <input name="id" className={clsx(styles.hidden)} value={locationId} readOnly></input>

                    <div className={styles.imageAndInputsContainer}>
                        <ReviewImageCreator setImageData={setImageData} imgString={imgString} />

                        <div className={styles.inputsContainer}>
                            <label htmlFor="locationData" className={clsx(styles.label)}>Location</label>
                            <input name="locationData" className={clsx(styles.input)} value={locationName} disabled={true} />

                            <label htmlFor="price" className={styles.label}>Price</label>
                            <div className={clsx(styles.input, styles.priceContainer)}>
                                <span className={clsx(styles.poundSign)}>£</span>
                                <input name="price" type="text" className={clsx(styles.input, styles.price, styles.pricee)} aria-required="true" onInput={validateNumber} value={price}></input>
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
                    <textarea name="comments" className={clsx(styles.input, styles.comment)} value={review?.comments ?? undefined} />

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
