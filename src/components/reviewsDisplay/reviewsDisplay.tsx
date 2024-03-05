"use client"
import closeImg from "../../../public/images/close.png"
import Image from "next/image"
import clsx from "clsx"
import { Location, LocationData } from "@/utils/types"
import { useState } from "react"
import styles from "./reviewsDisplay.module.scss"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"
import ReviewList from "../reviewList/reviewList"
import AddNewReviewToLocation from "../addReviewToLocation/addReviewToLocation"

interface Props {
    locationData: LocationData
    session: Session | null
}


export default function ReviewsDisplay({ locationData, session }: Props) {
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
                <h2>{locationData.name}</h2>
                <button onClick={close} className={clsx(styles.button, styles.close)}><Image src={closeImg} alt="close icon"  height={20} /></button>
            </div>
            {showOrAdd === "show" ?
                <>
                    <ReviewList reviews={locationData.Review} images={locationData.images}/>
                    <button onClick={handleAddShowButton} className={clsx(styles.button, styles.add)}>Add Guinness for this location</button>
                </>
                :
                <AddNewReviewToLocation locationData={locationData} setShowOrAdd={setShowOrAdd} />
            }
        </div>
    )
}


