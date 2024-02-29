"use client"
import styles from "./addButton.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Session } from "next-auth"
import { logOut } from "@/lib/user_server_actions"
import clsx from "clsx"

interface Props {
    session: Session | null
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
                                <button className={styles.addButton}>Log out</button>
                            </form>
                        }
                        <button onClick={onClick} className={clsx(styles.addButton, !isNotOnAddPage && styles.isAdding)}>{isNotOnAddPage ? "Add new Guinness location" : "Cancel"}</button>
                    </>
                }
            </div>
        </div>
    )
}
