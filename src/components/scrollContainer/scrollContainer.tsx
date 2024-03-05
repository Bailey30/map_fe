"use client"
import { useEffect } from "react"
import styles from "./scrollContainer.module.scss"
import { usePathname } from "next/navigation"
import GuinnessMarker from "../guinnessMarker/guinessMarker"
export default function ScrollContainer({ children }: any) {

    const pathname = usePathname()
    const isAdding = pathname === "/location"

    function detectscroll() {
        if (typeof document !== "undefined") {
            const root = document.documentElement
            const el = document.getElementById("scroll")

            // info comes from "GetReviewPanel" in location/[slug]/page.tsx
            const info = document.getElementById("info")
            console.log({ el })

            el?.addEventListener("scroll", function() {
                if (!info) return
                console.log("info exists scroll event listernerc")
                const top = info.getBoundingClientRect()


                // this is to set the height of the review container (.detailsContainer) so it stays within the screen
                root.style.setProperty("--scrollTop", (top.y + 80).toString() + "px")

                const scrollTop = root.style.getPropertyValue("--scrollTop")

            })
        }
    }

    useEffect(() => {
        detectscroll()
        window.scroll(0, 0)
    }, [])

    return <>
        {isAdding && <GuinnessMarker />}
        <div id="scroll" className={styles.scrollContainer}><>{children}</></div>
    </>

}
