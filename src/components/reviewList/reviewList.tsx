"use client"
import { useSession } from "next-auth/react"
import { Review } from "@/utils/types"
import Image from "next/image"
import clsx from "clsx"
import styles from "./reviewList.module.scss"
import formatDate from "../../utils/formatDate"
import guinness from "../../../public/images/guinness.png"
import deleteIcon from "../../../public/images/delete.png"
import { useAppDispatch } from "@/redux/hooks"
import { useEffect, useState } from "react"
import { SET_LOADING, TOGGLE_LOADING } from "@/redux/controlsSlice"
import { EXPORT_MARKER } from "next/dist/shared/lib/constants"
import DeletePopup from "../deletePopup/deletePopup"
import { auth } from "@/lib/auth"
import { Session } from "next-auth"

interface ReviewListProps {
    reviews: Review[] | null
    images: { [key: string]: string }
    session: Session | null
}

export default function ReviewList({ reviews, images, session }: ReviewListProps) {
    const dispatch = useAppDispatch()
    console.log({ session })
    console.log(session?.user?.id)

    useEffect(() => {
        console.log("review list useffect")
        dispatch(SET_LOADING(false))
    }, [])

    return (
        <>
            <div className={styles.detailsContainer} id="details">
                {reviews && reviews.map((review: Review, i: number) => {
                    const img = review.imageId ? images[review.imageId.toString()] : null
                    return <ReviewComponent review={review} i={i} key={review.id} totalReviews={reviews.length} image={img} userId={session?.user.id} />

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
    userId: number | undefined
}

function ReviewComponent({ review, i, totalReviews, image, userId }: ReviewProps) {
    const [deletePopup, setDeletePopup] = useState<boolean>(false)
    const ratingArr = [1, 2, 3, 4, 5]


    return (
        <div className={clsx(styles.detailsInner)}>
            {deletePopup &&
                <DeletePopup setDeletePopup={setDeletePopup} review={review} />
            }

            <div className={clsx(styles.imageAndDetails, deletePopup && styles.fade)}>

                <div className={styles.details}>
                    <div className={clsx(styles.topRow)}>

                        <p className={clsx(styles.reviewDetail, styles.name)}>{review.creator.username}</p>
                        {userId === review.creatorId &&
                            <span><Image onClick={() => setDeletePopup(true)} src={deleteIcon.src} alt="delete icon" width={20} height={20} /></span>
                        }

                    </div>
                    <div className={clsx(styles.reviewDetail, styles.group)}>
                        <span className={clsx(styles.reviewDetail, styles.price)}>£{formatMoney(review.price)}</span>
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

function formatMoney(amount: number) {
    // Check if the amount has a decimal point
    if (amount % 1 === 0) {
        // If there is no decimal point, return the amount without decimals
        return amount.toFixed(0);
    } else {
        // If there is a decimal point, return the amount with 2 decimal places
        return amount.toFixed(2);
    }
}
