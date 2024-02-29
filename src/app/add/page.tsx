"use client"
import styles from "./add.module.css"
import Link from "next/link"
import GuinnessMarker from "@/components/guinnessMarker/guinessMarker"

export default function AddingOverlay() {
    return (
        <div className={styles.addingOverlayContainer}>
            <GuinnessMarker/>
            <p className={styles.instructions}>Move the map to the correct location</p>
            <Link href="/review" className={styles.saveButton}>Add</Link>
        </div>
    )
}
