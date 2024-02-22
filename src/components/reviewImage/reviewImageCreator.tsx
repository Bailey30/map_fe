"use client"
import { useEffect, useRef, useState } from "react"
import styles from "./reviewImageCreator.module.css"
import { start } from "repl"
import clsx from "clsx"
import CameraPortal from "./CameraPortal"
import { current } from "@reduxjs/toolkit"
export default function ReviewImageCreator() {
    const [streaming, setStreaming] = useState<boolean>(false)
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [height, setHeight] = useState<number>(0)
    const [takingPicture, setTakingPicture] = useState<boolean>(false)
    const [confirmingPicture, setConfirmingPicture] = useState<boolean>(false)
    const previewCanvas = useRef<HTMLCanvasElement>(null)
    const captureArea = useRef<HTMLDivElement>(null)
    const video = useRef<HTMLVideoElement>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const finalPhoto = useRef<HTMLImageElement>(null)
    const startButton = useRef<HTMLButtonElement>(null)

    const isMobile = window.innerWidth < window.innerHeight
    const isDesktop = window.innerWidth > window.innerHeight

    function startUp(e: any) {
        console.log("startUp")
        if (!video.current) return
        if (!canvas.current) return
        if (!startButton.current) return

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" }, audio: false })
            .then((stream: any) => {
                if ('srcObject' in video.current!) {
                    video.current!.srcObject = stream
                } else {
                    video.current!.src = URL.createObjectURL(stream)
                }
                video!.current!.srcObject = stream
                video!.current!.play()
            })
            .catch((err) => {
                console.error(`an error occurred: ${err}`)
            })

        e.preventDefault()
    }

    function clearPhoto() {
        const context = canvas.current?.getContext("2d")
        context!.fillStyle = "#AAA"
        context!.fillRect(0, 0, canvas.current!.width, canvas.current!.height)

        const data = canvas.current!.toDataURL("image/png")
    }

    // paintToCanvas
    function startCamera() {
        const context = canvas.current?.getContext("2d")

        if (width) {
            setTakingPicture(true)
            canvas.current!.width = width
            canvas.current!.height = height
            // the original that works
            return setInterval(() => {
                context?.drawImage(video.current!, 0, 0, width, height)
            }, 16)

        } else {
            console.log("clearingPhoto")
            clearPhoto()
        }
    }

    function takePicture() {
        const context = previewCanvas.current?.getContext("2d")

        // handles setting the size of the preview image and capture area
        if (isMobile) {
            // MOBILE
            previewCanvas.current!.setAttribute("width", window.innerWidth.toString())
            previewCanvas.current!.setAttribute("height", window.innerWidth.toString())
        } else {
            // FOR DESKTOP / LANDSCAPE
            previewCanvas.current!.setAttribute("width", window.innerHeight.toString())
            previewCanvas.current!.setAttribute("height", window.innerHeight.toString())
        }

        const h = previewCanvas.current!.getAttribute("width")
        console.log({ h })
        // handles drawing the preview image
        if (isMobile) {
            // MOBILE
            context!.drawImage(video.current!,
                0, (video.current!.videoHeight / 2) - (video.current!.videoWidth / 2),
                video.current!.videoWidth, video.current!.videoWidth,
                0, 0,
                previewCanvas.current!.width, previewCanvas.current!.height
            )
        } else {
            // FOR DESKTOP / LANDSCAPE
            context!.drawImage(video.current!,
                Math.abs((video.current!.videoWidth / 2) - (video.current!.videoHeight / 2)), 0, // from x and y // video.videowidth
                video.current!.videoHeight, video.current!.videoHeight, // take square
                0, 0, // draw to canvas
                previewCanvas.current!.width, previewCanvas.current!.height, // size that is drawn
            )
        }

        setConfirmingPicture(true)
    }

    useEffect(() => {
        // do this to prevent native IOS video overlay
        video.current!.setAttribute('autoplay', '');
        video.current!.setAttribute('muted', '');
        video.current!.setAttribute('playsinline', '')


        if (isMobile) {
            captureArea.current!.style.width = window.innerWidth.toString() + "px"
            captureArea.current!.style.height = window.innerWidth.toString() + "px"
        } else {
            captureArea.current!.style.width = window.innerHeight.toString() + "px"
            captureArea.current!.style.height = window.innerHeight.toString() + "px"
        }

        video!.current!.addEventListener(
            "canplay",
            (ev) => {
                let localHeight = 0;
                if (!streaming) {
                    localHeight = (video!.current!.videoHeight / video!.current!.videoWidth) * width
                    setHeight(localHeight)

                    // mobile
                    if (isMobile) {
                        // video.current?.setAttribute("width", window.innerHeight.toString())
                        canvas.current!.width = video.current!.videoWidth
                        canvas.current!.height = video.current!.videoHeight
                    } else {
                        video.current?.setAttribute("height", window.innerHeight.toString())

                    }
                    // canvas.current?.setAttribute("width", (width).toString())
                    // canvas.current?.setAttribute("height", (localHeight).toString())
                    setStreaming(true)


                    startCamera()
                }
                ev.preventDefault()
            },
            false
        )
    }, [])

    useEffect(() => {
        console.log({ height })
    }, [height])


    function savePicture(e: any) {
        setConfirmingPicture(false)
        setTakingPicture(false)

        const data = previewCanvas.current!.toDataURL("image/png")
        finalPhoto.current!.setAttribute("src", data)
        e.preventDefault()
    }
    function retakePicture(e: any) {
        setConfirmingPicture(false)
        e.preventDefault()
    }
    function cancelTakingPicture(e: any) {
        setConfirmingPicture(false)
        setTakingPicture(false)
        clearPhoto()
        e.preventDefault()
    }

    return <>
        <CameraPortal>
            <div className={clsx(takingPicture && styles.openCamera, styles.camera)}>
            <div className={styles.captureAreaContainer}>
                <div className={styles.captureArea} ref={captureArea}></div>
                </div>
                <div className={styles.captureImage}>
                    <video id="video" ref={video}>Video stream not available</video>
                    <div className={styles.optionButtons}>
                        <button onClick={takePicture}>Take picture</button>
                        <button onClick={cancelTakingPicture}>Cancel</button>
                    </div>
                </div>
                <div className={clsx(confirmingPicture && styles.show, styles.confirmingOutput)}>
                    <canvas ref={previewCanvas} className={styles.previewCanvas} />
                    <div className={styles.optionButtons}>
                        <button onClick={savePicture}>Save</button>
                        <button onClick={retakePicture}>Retake</button>
                        <button onClick={cancelTakingPicture}>Cancel</button>
                    </div>
                </div>
            </div>
        </CameraPortal>

        <button id="startButton" ref={startButton} onClick={startUp}>Take photo</button>
        <canvas id="canvas" ref={canvas} className={styles.canvas}></canvas>

        <div className={styles.output}>
            <img ref={finalPhoto} alt="the saved photo to be uploaded" />
        </div>
    </>
}
