import { Review } from "@/utils/types"
import Image from "next/image"
import clsx from "clsx"
import { Suspense, useEffect, useState } from "react"
import styles from "./reviewList.module.scss"
import { formatDate } from "@/utils/formatDate"
import guinness from "../../../public/images/guinness.png"
import placeholder from "../../../public/images/guinness_placeholder.png"

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
        <>
            <div className={styles.detailsContainer} id="details">
                {reviews && reviews.map((review: Review, i: number) => {
                    return <Review review={review} active={active} i={i} key={review.id} totalReviews={reviews.length} />

                })}
            </div>
        </>
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

    const ratingArr = [1, 2, 3, 4, 5]

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
                <p className={clsx(styles.count)}>{active + 1}/{totalReviews}</p>

                <div className={styles.details}>
                    <p className={clsx(styles.reviewDetail, styles.name)}>{review.creator.username}</p>
                    <div className={clsx(styles.reviewDetail, styles.group)}>
                        <span className={clsx(styles.reviewDetail, styles.price)}>£{review.price}</span>
                        <div className={styles.ratingContainer}>
                            {
                                ratingArr.map((g, i) => {
                                    return <Image src={guinness} alt="Guinness rating" key={i} width={20} height={20} className={clsx(styles.star, i <= review.rating - 1 && styles.active)} />
                                })}
                        </div>

                        <span className={clsx(styles.value, styles.createdAt)}>{formatDate(review.createdAt)}</span>

                    </div>
                    <p className={clsx(styles.reviewDetail, styles.comments)}> <span className={styles.value}>{review.comments}</span></p>
                    <Image src={imageData !== "" ? imageData : placeholder} alt="guinness for the associated review" height={100} width={100} className={styles.reviewImage} />
                </div>
            </div>
        </div>
    )
}
