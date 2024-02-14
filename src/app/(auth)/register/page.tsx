"use client"
import { useFormState, useFormStatus } from "react-dom"
import {register} from "@/lib/user_server_actions"
import styles from "../auth.module.css"

export default function RegisterPage(){
const [errorMessage, serverAction] = useFormState(register, undefined)
const {pending} = useFormStatus()
    return (
        <div className={styles.pageContainer} >
            <form action={serverAction} className={styles.form}>
            <label htmlFor="email">email</label>
            {errorMessage?.email && <p>{errorMessage.email}</p>}
            <input type="text" name="email"/>
            <label htmlFor="password">password</label>
            {errorMessage?.password && <p>{errorMessage.password}</p>}
            <input type="text" name="password"/>
            <label htmlFor="passwordRepeat">type password again</label>
            <input type="text" name="passwordRepeat"/>
            <button type="submit">Register</button>
            </form> 
            {pending && <p>hang on</p>}
        </div>
    )
}
