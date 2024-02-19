
"use client"
import styles from "./add.module.css"
import guinness from "../../../public/images/guinness.png"
import Image from "next/image"
import { useAppSelector } from "@/redux/hooks"
import Link from "next/link"

export default function AddingOverlay() {
    const isAdding = useAppSelector((state) => state.controls.isAdding)
    // if(!isAdding) return 
    return (
        <div className={styles.addingOverlayContainer}>
            <Image src={guinness} alt={"guinness marker"} className={styles.marker} />
            <p className={styles.instructions}>Move the map to the correct location</p>

                <Link href="/review" className={styles.saveButton}>Add</Link>
        </div>
    )
}
