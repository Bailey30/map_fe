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
            const info = document.getElementById("info") // info comes from "GetReviewPanel" in location/[slug]/page.tsx
            console.log({ info })

            el?.addEventListener("scroll", function() {
                if (!info) return
                const top = info.getBoundingClientRect() // this is the distance from the top of the viewport

                // this is to set the height of the review container (.detailsContainer) so it stays within the screen
                root.style.setProperty("--scrollTop", (top.y + 80).toString() + "px")

                const scrollTop = root.style.getPropertyValue("--scrollTop")
                console.log({ scrollTop })

            })

            let top: any;
            let diff: any
            let startY: any
            info?.addEventListener("touchstart", (e) => {
                // calculate the difference between the touch and the top of the container at the start of the movement
                top = info.getBoundingClientRect()
                diff = e.touches[0].clientY - top.y
                startY = e.touches[0].clientY
                console.log({ startY })

            })

            // set top to: point that is touched minus difference between that point and top of container 
            let endY: any
            let direction: any
            let snappedTo: "top" | "middle" | "bottom" | undefined
            info?.addEventListener(
                "touchmove",
                (e) => {
                    // console.log(e)
                    // set position of top of container to be where the touch is minus the distance to the top of the container
                    const posY = e.touches[0].clientY - diff
                    root.style.setProperty("--scroll", posY + "px")

                    if (posY < 20) {
                        root.style.setProperty("--scroll", 20 + "px")
                    }
                    if (posY > window.innerHeight - 100) {
                        console.log("end reached")
                        root.style.setProperty("--scroll", window.innerHeight - 100 + "px")
                    }

                    // detect direction
                    endY = e.changedTouches[0].clientY
                    // console.log({ endY })
                    if (endY < startY) {
                        direction = "up"
                    } else if (endY > startY) {
                        direction = "down"
                    }


                    if (posY < window.innerHeight / 2 && direction === "up") {
                        // snap to top
                        console.log("up and past half way")
                        info.style.setProperty("transition", "transform  0.4s ease")
                        root.style.setProperty("--scroll", 20 + "px")
                        snappedTo = "top"
                    } else if (posY > window.innerHeight / 4 && direction === "down" && snappedTo !== "middle") {
                        // snap top middle
                        info.style.setProperty("transition", "transform  0.4s ease")
                        root.style.setProperty("--scroll", (window.innerHeight / 100) * 60 + "px")
                        setTimeout(() => {
                            snappedTo = "middle"
                        }, 400)
                    } else if (posY > (window.innerHeight / 4) * 3 && direction === "down" && snappedTo !== "bottom") {
                        // snap to bottom
                        info.style.setProperty("transition", "transform  0.4s ease")
                        root.style.setProperty("--scroll", (window.innerHeight / 5) * 4 + "px")
                        setTimeout(() => {
                            snappedTo = "bottom"
                        }, 400)
                    } else if (posY < (window.innerHeight / 4) * 3 && direction === "up" && snappedTo === "bottom") {
                        // snap to middle from bottom
                        info.style.setProperty("transition", "transform  0.4s ease")
                        root.style.setProperty("--scroll", (window.innerHeight / 100) * 60 + "px")
                        setTimeout(() => {
                            snappedTo = "middle"
                        }, 400)
                    } else {
                        info.style.setProperty("transition", "unset")
                    }
                },
                false,
            );

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
