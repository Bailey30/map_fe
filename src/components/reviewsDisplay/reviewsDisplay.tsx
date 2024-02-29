"use client"
import clsx from "clsx"
import { Location } from "@/utils/types"
import { useState } from "react"
import styles from "./reviewsDisplay.module.scss"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"
import ReviewList from "../reviewList/reviewList"
import AddNewReviewToLocation from "../addReviewToLocation/addReviewToLocation"

interface Props {
    location: Location
    session: Session | null
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

    return (
        <div className={styles.displayContainer}>
            <div className={styles.topbar}>
                <h2>{location.name}</h2>
                <button onClick={close} className={clsx(styles.button, styles.close)}>close</button>
            </div>
            {showOrAdd === "show" ?
                <>
                    <ReviewList reviews={location.Review} />
                    <button onClick={handleAddShowButton} className={clsx(styles.button, styles.add)}>Add Guinness for this location</button>
                </>
                :
                <AddNewReviewToLocation location={location} setShowOrAdd={setShowOrAdd} />
            }
        </div>
    )
}


