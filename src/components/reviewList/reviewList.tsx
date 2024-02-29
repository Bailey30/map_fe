import { Review } from "@/utils/types"
import Image from "next/image"
import clsx from "clsx"
import { Suspense, useEffect, useState } from "react"
import styles from "./reviewList.module.scss"
import { warn } from "console"
import { formatDate } from "@/utils/formatDate"

interface ReviewListProps {
    reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
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
            <div className={clsx(styles.arrow, styles.left)} onClick={previous}>{`<`}</div>
            {reviews && reviews.map((review: Review, i: number) => {
                return <Review review={review} active={active} i={i} key={review.id} totalReviews={reviews.length} />
            })}
            <div className={clsx(styles.arrow, styles.right)} onClick={next}>{`>`}</div>
        </div>
    )
}

interface ReviewProps {
    review: Review
    active: number
    i: number
    totalReviews: number
}
function Review({ review, active, i, totalReviews }: ReviewProps) {
    const [imageData, setImageData] = useState<string>("")

    useEffect(() => {
        if (active === i && review.imageId && imageData === "") {
            console.log(review.id)
            fetch(process.env.NEXT_PUBLIC_URL as string + `/api/image?location=${review.locationId}&review=${review.id}`, { method: "GET", cache: "force-cache" })
                .then((res) => {
                    console.log({ res })
                    return res.json()
                })
                .then((res) => {
                    console.log({ res })
                    setImageData(res.image)
                })
        }

    }, [active])

    return (
        <div className={clsx(styles.detailsInner, active === i && styles.activeReview)}>
            <div className={styles.imageAndDetails}>
                <Image src={imageData} alt="guinness for the associated review" height={100} width={100} className={styles.reviewImage} />
                <p className={clsx(styles.count)}>{active + 1}/{totalReviews}</p>

                <div className={styles.details}>
                    <p className={clsx(styles.reviewDetail, styles.name)}>{review.creator.username}</p>
                    <p className={clsx(styles.reviewDetail, styles.group)}> 
                    <span className={styles.value}>£{review.price}</span>
                    <span className={styles.value}>{review.rating}</span>
                    <span className={clsx(styles.value, styles.createdAt)}>{formatDate(review.createdAt)}</span>

                    </p>
                    <p className={clsx(styles.reviewDetail, styles.comments)}> <span className={styles.value}>{review.comments}</span></p>
                </div>
            </div>
        </div>
    )
}
