import { Dispatch, SetStateAction, useRef } from "react"
// import styles from "./addReviewToLocation.module.scss"
import styles from "../../app/review/review.module.scss"
import UseCreateReview from "@/utils/useCreateReview"
import clsx from "clsx"
import { Location } from "@/utils/types"
import ReviewImageCreator from "../reviewImage/reviewImageCreator"
import Pending from "../pending/pending"

interface AddNewReviewToLocationProps {
    location: Location
    setShowOrAdd: Dispatch<SetStateAction<"show" | "add">>
}

export default function AddNewReviewToLocation({ location, setShowOrAdd }: AddNewReviewToLocationProps) {
    const { setImageData, message, formAction } = UseCreateReview()

    return (
        < >
            {message?.success !== true &&
                <form action={formAction} className={styles.form}>
                    <input name="id" className={clsx(styles.hidden)} value={location.id} readOnly></input>

                    <div className={styles.imageAndInputsContainer}>

                        <ReviewImageCreator setImageData={setImageData} />
                        <div className={styles.inputsContainer}>
                        <label htmlFor="location" className={clsx(styles.label)}>Location</label>
                        <input name="location" className={clsx(styles.input)} value={location.name} disabled={true}/>

                            <label htmlFor="price" className={styles.label}>Price</label>
                            <input name="price" type="number" className={styles.input}></input>
                            {message?.errors?.price && <p className={styles.errorMessage}>{message?.errors?.price}</p>}

                            <label htmlFor="rating" className={styles.label}>Rating</label>
                            <input name="rating" type="number" className={styles.input} />
                            {message?.errors?.rating && <p className={styles.errorMessage}>{message?.errors?.rating}</p>}

                        </div>
                    </div>

                    <label htmlFor="comments" className={clsx(styles.label, styles.comment)}>Comments - optional</label>
                    <input type="text" name="comments" className={clsx(styles.input, styles.comment)} />

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
