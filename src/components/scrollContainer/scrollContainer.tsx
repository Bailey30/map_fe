"use client"
import { useEffect } from "react"
import styles from "./scrollContainer.module.scss"
export default function ScrollContainer({ children }: any) {

    function detectscroll() {
        if (typeof document !== "undefined") {
            const root = document.documentElement
            const el = document.getElementById("scroll")
            // info comes from "GetReviewPanel" in review/[slug]/page.tsx
            const info = document.getElementById("info")
            console.log({ el })

            el?.addEventListener("scroll", function() {
                if (!info) return
                    console.log("info exists scroll event listernerc")
                const top = info.getBoundingClientRect()

                // console.log({ top })

                // this is to set the height of the review container (.detailsContainer) so it stays within the screen
                root.style.setProperty("--scrollTop", (top.y + 80).toString() + "px")

                const scrollTop = root.style.getPropertyValue("--scrollTop")
                // console.log({ scrollTop })
                //
                if(top.y < window.innerHeight / 2){
                    // el.style.setProperty("bottom", "0%")
                    // el.style.setProperty("top", "-100%")
                    // info.style.setProperty("top", "0%")
                    // info.style.setProperty("height", "200dvh")
                    // el.style.setProperty("height", "200dvh")
                }
                if (top.y < 0){

console.log("less that 0 ")
                    // el.style.setProperty("top", "-100%")
                }
            })
        }
    }

    useEffect(() => {
        detectscroll()
    }, [])

    return <div id="scroll" className={styles.scrollContainer}>{children}</div>
}
