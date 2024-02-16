"use client"
import clsx from "clsx"
import { Review } from "@/utils/types"
import { useState } from "react"
import styles from "./reviewsDisplay.module.css"
interface Props {
    reviews: Review[]
}

function formatDate(dateString: string) {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleString()
}

export default function ReviewsDisplay({ reviews }: Props) {
    const [active, setActive] = useState<number>(0)
    console.log({ reviews })
    console.log(reviews[active])
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
        <div>
            <div className={styles.detailsContainer}>
                <div className={clsx(styles.arrow, styles.right)} onClick={next}>{`<`}</div>
                <p>{reviewNumber}/{totalReviews}</p>
                <div>price: {reviews[active].price}</div>
                <div>rating: {reviews[active].rating}</div>
                <div>comments: {reviews[active].comments}</div>
                <div className={styles.details}>
                    <p>created at: {formatDate(reviews[active].createdAt)}</p>
                    <p>created by: {reviews[active].creator.username}</p>
                </div>
                <div className={clsx(styles.arrow, styles.right)} onClick={previous}>{`<`}</div>
            </div>
        </div>
    )
}
