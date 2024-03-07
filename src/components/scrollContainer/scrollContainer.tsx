"use client"
import { useEffect } from "react"
import styles from "./scrollContainer.module.scss"
import { usePathname } from "next/navigation"
import GuinnessMarker from "../guinnessMarker/guinessMarker"
import ScrollHandler from "./scrollHandler"

export default function ScrollContainer({ children }: any) {

    const pathname = usePathname()
    const isAdding = pathname === "/location"


    function toggleDetailsContainerTransition(mode: "on" | "off") {
        const details = document.getElementById("details")
        if (mode === "on") {
            // details?.style.setProperty("transition", "all 0.4s")
        } else {
            details?.style.setProperty("transition", "unset")
        }
    }

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    return <>
        {isAdding && <GuinnessMarker />}
        <div id="scroll" className={styles.scrollContainer}><>{children}</></div>
    </>

}
