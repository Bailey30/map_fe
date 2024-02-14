"use client"
import { useState } from "react"
import styles from "./addButton.module.css"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { TOGGLE_IS_ADDING } from "@/redux/controlsSlice"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import path from "path"
import { Session } from "next-auth"
import { logOut, login } from "@/lib/user_server_actions"

interface Props {
    session: Session
}
export default function AddButton({ session }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const isAdding = useAppSelector((state) => state.controls.isAdding)
    function onClick() {
        console.log(pathname)
        dispatch(TOGGLE_IS_ADDING())
        if (pathname.includes("/review")) {
            router.push("/")
        }
    }
    console.log({session})
    return (
        <div className={styles.addButtonContainer}>
            <div className={styles.topBarButtons}>
                {!session ?
                    <Link href="/login">
                        <button className={styles.addButton}>Login to add guinnesses</button>
                    </Link>
                    :
                    <>
                        {!isAdding &&
                            <form action={logOut}>
                                <button>Log out</button>
                            </form>
                        }
                        <button onClick={onClick} className={styles.addButton}>{!isAdding ? "Add Guinness" : "Cancel"}</button>
                    </>
                }
            </div>
            {isAdding &&
                <Link href="/review" className={styles.saveButton}>Add</Link>}
        </div>
    )
}
