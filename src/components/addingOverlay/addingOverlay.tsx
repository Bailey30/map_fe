"use client"
import styles from "./addingOverlay.module.css"
import guinness from "../../../public/images/guinness.png"
import Image from "next/image"
import { useAppSelector } from "@/redux/hooks"

export default function AddingOverlay() {
    const isAdding = useAppSelector((state) => state.controls.isAdding)
    if(!isAdding) return 
    return (
        <div className={styles.addingOverlayContainer}>
            <Image src={guinness} alt={"guinness marker"} className={styles.marker} />
            <p className={styles.instructions}>Move the map to the correct location</p>
        </div>
    )
}
