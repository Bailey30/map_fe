"use client"
import { useEffect, useState } from "react"
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
    const router = useRouter()
    const pathname = usePathname()
    const isNotOnAddPage = !pathname.includes("/add")
    function onClick() {
        console.log(pathname)
        if (pathname.includes("/review")) {
        }
        if (pathname.includes("/add")) {
            router.push("/")
        } else {
            router.push("/add")
        }
    }
    return (
        <div className={styles.addButtonContainer}>
            <div className={styles.topBarButtons}>
                {!session ?
                    <Link href="/login">
                        <button className={styles.addButton}>Login to add guinnesses</button>
                    </Link>
                    :
                    <>
                        {isNotOnAddPage &&
                            <form action={logOut}>
                                <button>Log out</button>
                            </form>
                        }
                        <button onClick={onClick} className={styles.addButton}>{isNotOnAddPage ? "Add new Guinness location" : "Cancel"}</button>
                    </>
                }
            </div>
        </div>
    )
}
