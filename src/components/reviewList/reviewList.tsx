"use client"
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
    images: { [key: string]: string }
}

export default async function ReviewList({ reviews, images }: ReviewListProps) {
    return (
        <>
            <div className={styles.detailsContainer} id="details">
                {reviews && reviews.map((review: Review, i: number) => {
                    const img = review.imageId ? images[review.imageId.toString()] : null
                    return <Review review={review} i={i} key={review.id} totalReviews={reviews.length} image={img} />

                })}
            </div>
        </>
    )
}


interface ReviewProps {
    review: Review
    i: number
    totalReviews: number
    image: string | null
}
async function Review({ review, i, totalReviews, image }: ReviewProps) {

    const ratingArr = [1, 2, 3, 4, 5]

    return (
        <div className={clsx(styles.detailsInner)}>
            <div className={styles.imageAndDetails}>

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
                    {image && <Image unoptimized src={formatBase64String(image)} alt="Guinness for the current review" width={100} height={100} />}
                </div>
            </div>
        </div>
    )
}

function formatBase64String(string: string): string {
    return decodeURIComponent("data:image/jpeg;base64, " + string)
}
