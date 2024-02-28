"use client"
import clsx from "clsx"
import { Location, Review } from "@/utils/types"
import { Dispatch, SetStateAction, Suspense, useEffect, useRef, useState } from "react"
import styles from "./reviewsDisplay.module.css"
import { createReviewSQL } from "@/lib/server_actions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import ReviewImageCreator from "../reviewImage/reviewImageCreator"
import { Session } from "next-auth"
import Pending from "../pending/pending"
import { MapState } from "@/redux/slice"
import Image from "next/image"
import UseCreateReview from "@/utils/useCreateReview"

interface Props {
    location: Location
    session: Session | null
}

function formatDate(dateString: string) {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleString()
}

export default function ReviewsDisplay({ location, session }: Props) {
    const router = useRouter()
    const [showOrAdd, setShowOrAdd] = useState<"show" | "add">("show")
    function handleAddShowButton() {
        if (session) {

            showOrAdd === "add" ? setShowOrAdd("show") : setShowOrAdd("add")
        } else {
            router.push("/login")
        }
    }
    function close() {
        router.push("/")
    }
    const buttonMessage = () => {
        return session ? "Add guinness for this location" : "Sign in to add guinness for this location"
    }
    return (
        <div className={styles.displayContainer}>
            <div className={styles.topbar}>
                <h2>{location.name}</h2>
                <button onClick={close}>close</button>
            </div>
            {showOrAdd === "show" ?
                <ReviewList reviews={location.Review} />
                :
                <AddNewReviewToLocation location={location} cancel={() => setShowOrAdd("show")} />
            }
            <button onClick={handleAddShowButton} className={styles.addButton}>{showOrAdd === "show" ? buttonMessage()
                : "Back"}</button>
        </div>
    )
}

interface ReviewListProps {
    reviews: Review[]
}

function ReviewList({ reviews }: ReviewListProps) {
    const [active, setActive] = useState<number>(0)
    const totalReviews = reviews.length
    const reviewNumber = active+ 1

    function next() {
        if (active < totalReviews - 1) {
            setActive(active+ 1)
        }
    }
    function previous() {
        if (active > 0) {
            setActive(active- 1)
        }
    }

    return (
        <div className={styles.detailsContainer}>
            <div className={clsx(styles.arrow, styles.right)} onClick={previous}>{`<`}</div>
            <p className={styles.reviewDetail}>{reviewNumber}/{totalReviews}</p>
            <Suspense fallback={"...loading"}>
                {reviews && reviews.map((review: Review, i: number) => {
                    return <Review review={review} active={active} i={i} key={review.id} />
                })}
            </Suspense>
            <div className={clsx(styles.arrow, styles.right)} onClick={next}>{`>`}</div>
        </div>
    )
}

interface ReviewProps {
    review: Review
    active: number
    i: number
}
function Review({ review, active, i }: ReviewProps) {
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
                <div className={styles.details}>
                    <p className={styles.reviewDetail}>price: {review.price}</p>
                    <p className={styles.reviewDetail}>rating: {review.rating}</p>
                    <div className={styles.creationDetail}>
                        <p>created at: {formatDate(review.createdAt)}</p>
                        <p>created by: {review.creator.username}</p>
                    </div>
                </div>
            </div>
            <p className={styles.reviewDetail}>comments: {review.comments}</p>
        </div>
    )
}

interface AddNewReviewToLocationProps {
    location: Location
    cancel: Dispatch<SetStateAction<"show" | "add">>
}

function AddNewReviewToLocation({ location, cancel }: AddNewReviewToLocationProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const { setImageData, message, formAction } = UseCreateReview()
    // const [imageData, setImageData] = useState<any>()
    // const mapState: MapState = {
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     zoom: 10
    // }
    // const reviewData: { mapState: MapState, imageData: string | undefined } = {
    //     mapState,
    //     imageData,
    // }
    // const createReviewWithLocation = createReviewSQL.bind(null, reviewData)
    // const [message, formAction] = useFormState(createReviewWithLocation, null)

    return (
        <div className={styles.infoPanel}>
            {message?.success !== true &&
                <form action={formAction}>
                    <input name="id" className={clsx(styles.hidden)} value={location.id} readOnly></input>
                    <label htmlFor="location" className={clsx(styles.hidden)}>Location</label>
                    <input name="location" className={clsx(styles.hidden)}></input>

                    <ReviewImageCreator setImageData={setImageData} />


                    <label htmlFor="price">price</label>
                    <input name="price" type="number"></input>
                    {message?.errors?.price && <p className={styles.errorMessage}>{message?.errors?.price}</p>}

                    <label htmlFor="rating">rating</label>
                    <input name="rating" type="number" />
                    {message?.errors?.rating && <p className={styles.errorMessage}>{message?.errors?.rating}</p>}

                    <label htmlFor="comments">comments</label>
                    <input type="text" name="comments" />

                    <div className={styles.buttonContainer}>
                        <button className={styles.save} type="submit">Save</button>
                    </div>
                    <Pending />
                    {message?.success === false && <p className={styles.errorMessage}>An error occured</p>}
                </form>
            }
            {message?.success === true &&
                <p className={styles.successMessage}>guinness successfully added!</p>
            }
        </div>
    )
}
