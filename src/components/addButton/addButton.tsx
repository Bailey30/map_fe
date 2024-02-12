"use client"
import { useState } from "react"
import styles from "./addButton.module.css"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { TOGGLE_IS_ADDING } from "@/redux/controlsSlice"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export default function AddButton() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const isAdding = useAppSelector((state) => state.controls.isAdding)
    function onClick() {
        dispatch(TOGGLE_IS_ADDING())
       if (pathname === "/review"){
           router.push("/")
       }
    }
    return (
        <div className={styles.addButtonContainer}>
            <button onClick={onClick} className={styles.addButton}>{!isAdding ? "Add Guinness" : "Cancel"}</button>
            {isAdding &&
                <Link href="/review" className={styles.saveButton}>Add</Link>            }
        </div>
    )
}
