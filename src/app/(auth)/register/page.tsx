"use client"
import { useFormState, useFormStatus } from "react-dom"
import {register} from "@/lib/user_server_actions"
import styles from "../auth.module.css"
import Link from "next/link"

export default function RegisterPage(){
const [errorMessage, serverAction] = useFormState(register, undefined)
const {pending} = useFormStatus()
console.log({pending})
    return (
        <div className={styles.pageContainer} >
            <form action={serverAction} className={styles.form}>

            <label htmlFor="username">username</label>
            <input type="text" name="username"/>
            {errorMessage?.username && <p>{errorMessage.username}</p>}

            <label htmlFor="email">email</label>
            <input type="text" name="email"/>
            {errorMessage?.email && <p>{errorMessage.email}</p>}

            <label htmlFor="password">password</label>
            <input type="text" name="password"/>
            {errorMessage?.password && <p>{errorMessage.password}</p>}

            <label htmlFor="passwordRepeat">type password again</label>
            <input type="text" name="passwordRepeat"/>

            <button type="submit">Register</button>
            <Link href="/login">Already have an account? Log in.</Link>
            </form> 



            {pending && <p>hang on</p>}
        </div>
    )
}
