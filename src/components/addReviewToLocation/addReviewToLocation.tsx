import { Dispatch, SetStateAction, useRef, useState } from "react"
// import styles from "./addReviewToLocation.module.scss"
import styles from "../../app/review/review.module.scss"
import UseCreateReview from "@/utils/useCreateReview"
import clsx from "clsx"
import { Location, LocationData } from "@/utils/types"
import ReviewImageCreator from "../reviewImage/reviewImageCreator"
import Pending from "../pending/pending"
import StarRating from "../starRating/starRating"

interface AddNewReviewToLocationProps {
    locationData: LocationData
    setShowOrAdd: Dispatch<SetStateAction<"show" | "add">>
}

export default function AddNewReviewToLocation({ locationData, setShowOrAdd }: AddNewReviewToLocationProps) {
    const { setImageData, message, formAction } = UseCreateReview()
const [ratingInput, setRatingInput] = useState<number>(1)
    return (
        < >
            {message?.success !== true &&
                <form action={formAction} className={styles.form}>
                    <input name="id" className={clsx(styles.hidden)} value={locationData.id} readOnly></input>

                    <div className={styles.imageAndInputsContainer}>

                        <ReviewImageCreator setImageData={setImageData} />
                        <div className={styles.inputsContainer}>
                        <label htmlFor="locationData" className={clsx(styles.label)}>Location</label>
                        <input name="locationData" className={clsx(styles.input)} value={locationData.name} disabled={true}/>

                            <label htmlFor="price" className={styles.label}>Price</label>
                            <input name="price" type="number" className={styles.input}></input>
                            {message?.errors?.price && <p className={styles.errorMessage}>{message?.errors?.price}</p>}

 <div className={styles.rating}>
                                        <label htmlFor="rating" className={clsx(styles.label, styles.hidden)} aria-required="true">Rating</label>
                                        <input name="rating" type="number" className={clsx(styles.input, styles.hidden)} value={ratingInput} />
                                        <StarRating setRatingInput={setRatingInput} />
                                    </div>

                        </div>
                    </div>

                    <label htmlFor="comments" className={clsx(styles.label, styles.comment)}>Comments - optional</label>
                    <textarea name="comments" className={clsx(styles.input, styles.comment)} />

                    <div className={styles.buttonContainer}>
                        <button className={clsx(styles.button, styles.save)} type="submit">Save</button>
                        <button className={clsx(styles.button, styles.cancel)} type="submit" onClick={()=>setShowOrAdd("show")}>Cancel</button>
                    </div>
                    <Pending />
                    {message?.success === false && <p className={styles.errorMessage}>An error occured</p>}
                </form>
            }
            {message?.success === true &&
                <p className={styles.successMessage}>guinness successfully added!</p>
            }
        </>
    )
}
