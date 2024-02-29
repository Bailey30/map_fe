"use client"
import { useFormState, useFormStatus } from "react-dom"
import { register } from "@/lib/user_server_actions"
import styles from "../auth.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Pending from "@/components/pending/pending"

export default function RegisterPage() {
    const router = useRouter()
    const [errorMessage, serverAction] = useFormState(register, undefined)
    function back() {
        router.push("/")
    }
    return (
        <div className={styles.pageContainer} >
            <button onClick={back}>Close</button>
            <form action={serverAction} className={styles.form}>

                <label htmlFor="username">username</label>
                <input type="text" name="username" />
                {errorMessage?.username && <p>{errorMessage.username}</p>}

                <label htmlFor="email">email</label>
                <input type="text" name="email" />
                {errorMessage?.email && <p>{errorMessage.email}</p>}

                <label htmlFor="password">password</label>
                <input type="password" name="password" />
                {errorMessage?.password && <p>{errorMessage.password}</p>}

                <label htmlFor="passwordRepeat">type password again</label>
                <input type="password" name="passwordRepeat" />

                <button type="submit">Register</button>
                <Link href="/login">Already have an account? Log in.</Link>
                <Pending/>
            </form>



        </div>
    )
}
