import closeImg from "../../../public/images/close.png"
import Image from "next/image"
import clsx from "clsx"
import { LocationData } from "@/utils/types"
import styles from "./reviewsDisplay.module.scss"
import { Session } from "next-auth"
import ReviewList from "../reviewList/reviewList"
import Link from "next/link"

interface Props {
    locationData: LocationData
    session: Session | null
}


export default function ReviewsDisplay({ locationData, session }: Props) {
    const buttonLink = session ? `${locationData.id}/add?location=${locationData.name}` : "/login"
    console.log("id", session?.user.id)
    return (
        <>
            <div className={styles.displayContainer}>
                <div className={styles.topbar} data-testid="location-name">
                    <h2>{locationData.name}</h2>
                    <Link href={"/"} className={clsx(styles.button, styles.close)}><Image src={closeImg} alt="close icon" height={20} /></Link>
                </div>
                <ReviewList reviews={locationData.Review} images={locationData.images} session={session} />
                <Link href={buttonLink} className={clsx(styles.button, styles.add)}>Add</Link>
            </div>
        </>
    )
}


