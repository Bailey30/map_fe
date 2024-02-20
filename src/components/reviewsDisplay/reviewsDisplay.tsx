"use client"
import clsx from "clsx"
import { Location, Review } from "@/utils/types"
import { Dispatch, SetStateAction, useState } from "react"
import styles from "./reviewsDisplay.module.css"
import { createReviewSQL } from "@/lib/server_actions"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

interface Props {
    location: Location
}

function formatDate(dateString: string) {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleString()
}

export default function ReviewsDisplay({ location }: Props) {
    const router = useRouter()
    const [showOrAdd, setShowOrAdd] = useState<"show" | "add">("show")
    function handleAddShowButton() {
        showOrAdd === "add" ? setShowOrAdd("show") : setShowOrAdd("add")
    }
    function close(){
      router.push("/") 
    }
    return (
        <div>
        <div>

            <h2>{location.name}</h2>
            <button onClick={close}>close</button>
            </div>
            {showOrAdd === "show" ?
                <ReviewList reviews={location.Review} />
                :
                <AddNewReviewToLocation location={location} cancel={() => setShowOrAdd("show")} />
            }
            <button onClick={handleAddShowButton}>{showOrAdd === "show" ? "Add guinness for this location" : "Back"}</button>
        </div>
    )
}

interface ReviewListProps {
    reviews: Review[]
}

function ReviewList({ reviews }: ReviewListProps) {
    const [active, setActive] = useState<number>(0)
    const totalReviews = reviews.length
    const reviewNumber = active + 1

    function next() {
        if (active < totalReviews - 1) {
            setActive(active + 1)
        }
    }
    function previous() {
        if (active > 0) {
            setActive(active - 1)
        }
    }

    return (
        <div className={styles.detailsContainer}>
            <div className={clsx(styles.arrow, styles.right)} onClick={previous}>{`<`}</div>
            <p>{reviewNumber}/{totalReviews}</p>
            <div>price: {reviews[active].price}</div>
            <div>rating: {reviews[active].rating}</div>
            <div>comments: {reviews[active].comments}</div>
            <div className={styles.details}>
                <p>created at: {formatDate(reviews[active].createdAt)}</p>
                <p>created by: {reviews[active].creator.username}</p>
            </div>
            <div className={clsx(styles.arrow, styles.right)} onClick={next}>{`>`}</div>
        </div>
    )
}

interface AddNewReviewToLocationProps {
    location: Location
    cancel: Dispatch<SetStateAction<"show" | "add">>
}

function AddNewReviewToLocation({ location, cancel }: AddNewReviewToLocationProps) {
    const coordindates = {
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 10
    }
    const createReviewWithLocation = createReviewSQL.bind(null, coordindates)
    const { pending, data } = useFormStatus();
    const [message, formAction] = useFormState(createReviewWithLocation, null)

    return (
        <div className={styles.infoPanel}>
            {message?.success !== true &&
                <form action={formAction}>
                /* <label htmlFor="id" className={clsx(styles.hidden)} /> */
                    <input name="id" className={clsx(styles.hidden)} value={location.id} readOnly></input>
                    <label htmlFor="location" className={clsx(styles.hidden)}>Location</label>
                    <input name="location" className={clsx(styles.hidden)}></input>

                    <label htmlFor="price">price</label>
                    <input name="price" type="number"></input>
                    {message?.errors?.price && <p>{message?.errors?.price}</p>}
                    <label htmlFor="rating">rating</label>
                    <input name="rating" type="number" />
                    {message?.errors?.rating && <p>{message?.errors?.rating}</p>}
                    <label htmlFor="comments">comments</label>
                    <input type="text" name="comments" />

                    <div className={styles.buttonContainer}>
                        <button className={styles.save} type="submit">Save</button>
                    </div>

                    {pending && <p>creating review...</p>}
                    {message?.success === false && <div>An error occured</div>}
                </form>
            }
            {message?.success === true &&
                <p>guinness successfully added!</p>
            }
        </div>
    )
    return <></>
}
