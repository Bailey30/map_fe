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
}

export default async function ReviewList({ reviews }: ReviewListProps) {
    const totalReviews = reviews.length

    return (
        <>
            <div className={styles.detailsContainer} id="details">
                {reviews && reviews.map((review: Review, i: number) => {
                    return <Review review={review} i={i} key={review.id} totalReviews={reviews.length} />

                })}
            </div>
        </>
    )
}

async function getImage(review: Review){
const imageData = 
        await fetch(process.env.NEXT_PUBLIC_URL as string + `/api/image?location=${review.locationId}&review=${review.id}`, { method: "GET", cache: "force-cache" })
            .then((res) => {
                console.log({ res })
                return res.json()
            })
            .then((res) => {
                console.log({ res })
                if (res.image) {
                    return res.image
                    // setImageData(res.image)
                }
            }) 
}

interface ReviewProps {
    review: Review
    i: number
    totalReviews: number
}
async function Review({ review, i, totalReviews }: ReviewProps) {

    const ratingArr = [1, 2, 3, 4, 5]
    // useEffect(() => {
    // if (review.imageId && imageData === "") {
    // const imageData = review.imageId ?
    //     await fetch(process.env.NEXT_PUBLIC_URL as string + `/api/image?location=${review.locationId}&review=${review.id}`, { method: "GET", cache: "force-cache" })
    //         .then((res) => {
    //             console.log({ res })
    //             return res.json()
    //         })
    //         .then((res) => {
    //             console.log(review.comments)
    //             console.log({ res })
    //             if (res.image) {
    //                 return res.image
    //                 // setImageData(res.image)
    //             }
    //         }) : ""
    // // }
    //
    // // }, [])

    // const imageData = review.imageId ? await getImage(review): ""

    // console.log({ imageData })

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

                </div>
            </div>
        </div>
    )
}
