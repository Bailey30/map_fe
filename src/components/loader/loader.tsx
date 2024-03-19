"use client"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import styles from "./loader.module.scss"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { SET_LOADING, TOGGLE_LOADING } from "@/redux/controlsSlice"
import guinness from "../../../public/images/guinness.png"

export default function Loader() {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const loading = useAppSelector((state) => state.controls.loading)

    useEffect(() => {
        if (pathname.includes("location") && pathname.split("/").length === 3) {
            dispatch(SET_LOADING(true))
        } else {
        }
    }, [pathname])

    useEffect(() => {
        console.log({ loading })
    }, [loading])

    return (
        loading && <div className={clsx(styles.loader)}><Image src={guinness.src} alt="Page loading icon" width={40} height={40} /></div>
    )
}
