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
    const video = useRef<HTMLVideoElement>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const photo = useRef<HTMLImageElement>(null)
    const finalPhoto = useRef<HTMLImageElement>(null)
    const startButton = useRef<HTMLButtonElement>(null)

    // maybe only call this when they click to add a photo
    function startUp(e:any) {
        console.log("startUp")
        if (!video.current) return
        if (!canvas.current) return
        if (!photo.current) return
        if (!startButton.current) return
        let localHeight = 0

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

        // clearPhoto()
        e.preventDefault()
    }

    function clearPhoto() {
        const context = canvas.current?.getContext("2d")
        context!.fillStyle = "#AAA"
        context!.fillRect(0, 0, canvas.current!.width, canvas.current!.height)

        const data = canvas.current!.toDataURL("image/png")
        photo.current!.setAttribute("src", data)
    }

    function startCamera() {
        console.log("startCamera")
        const context = canvas.current?.getContext("2d")
        console.log({ width })
        console.log({ height })

        if (width) {
            setTakingPicture(true)
            console.log("takingPicture")
            canvas.current!.width = width
            canvas.current!.height = height
            // the original that works
            context?.drawImage(video.current!, 0, 0, width, height)
        

        } else {
            console.log("clearingPhoto")
            clearPhoto()
        }
    }

    function takePicture() {
        const context = previewCanvas.current?.getContext("2d")

        // FOR DESKTOP / LANDSCAPE
        // opposites for mobile
        if (window.innerWidth < window.innerHeight) {
            previewCanvas.current!.width = video.current!.videoWidth
            previewCanvas.current!.height = video.current!.videoHeight
        } else {
            previewCanvas.current!.setAttribute("width", window.innerHeight.toString())
            previewCanvas.current!.setAttribute("height", window.innerHeight.toString())
        }

        // FOR DESKTOP / LANDSCAPE
        context!.drawImage(video.current!,
            Math.abs((video.current!.videoWidth / 2) - (video.current!.videoHeight / 2)), 0, // from x and y // video.videowidth
            video.current!.videoHeight, video.current!.videoHeight, // take square
            0, 0, // draw to canvas
            previewCanvas.current!.width, previewCanvas.current!.height, // size that is drawn
        )

        // possible not needed
        const data = canvas.current!.toDataURL("image/png")
        photo.current!.setAttribute("src", data)

        const aspectRatio = canvas.current!.width / canvas.current!.height
        let root = document.querySelector(":root") as any
        root.style.setProperty('--photoAspectRatio', aspectRatio.toString());
        //////////

        setConfirmingPicture(true)
    }

    useEffect(() => {
        video!.current!.addEventListener(
            "canplay",
            (ev) => {
                let localHeight = 0;
                if (!streaming) {
                    localHeight = (video!.current!.videoHeight / video!.current!.videoWidth) * width
                    setHeight(localHeight)

                    // mobile
                    if (window.innerWidth < window.innerHeight) {
                        video.current?.setAttribute("width", window.innerHeight.toString())
                        canvas.current!.width = video.current!.videoWidth
                        canvas.current!.height = video.current!.videoHeight
                    } else {
                        video.current?.setAttribute("height", window.innerHeight.toString())
                    }
                    canvas.current?.setAttribute("width", (width).toString())
                    canvas.current?.setAttribute("height", (localHeight).toString())
                    setStreaming(true)

                    video.current!.setAttribute('autoplay', '');
                    video.current!.setAttribute('muted', '');
                    video.current!.setAttribute('playsinline', '')
                    
                    startCamera()
                }
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
                <div className={styles.captureImage}>
                    <video id="video" ref={video}>Video stream not available</video>
                    <div className={styles.optionButtons}>
                        <button onClick={takePicture}>Take picture</button>
                        <button onClick={cancelTakingPicture}>Cancel</button>
                    </div>
                </div>
                <div className={clsx(confirmingPicture && styles.show, styles.confirmingOutput)}>
                    <canvas ref={previewCanvas} className={styles.previewCanvas} />
                    <img ref={photo} id="photo" alt="temporary image to confirm before saving" />
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
