"use client";
import { login } from "@/lib/user_server_actions";
import { auth, signIn } from "@/lib/auth";
import React, { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import styles from "../auth.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";

const LoginPage = () => {
    const router = useRouter()
    const [errorMessage, dispatch] = useFormState(login, undefined);

    useEffect(() => {
        console.log("login error", errorMessage);
    }, [errorMessage]);

    function back() {
        router.push("/")
    }

    return (
        <div className={styles.pageContainer}>
            <button onClick={back}>Close</button>
            <form action={dispatch} className={styles.form}>
                <input type="text" placeholder="email" name="email" />
                {/* <input type="email" placeholder="email" name="email" /> */}
                <input type="password" placeholder="password" name="password" />
                <button type="submit" >
                    Log in
                </button>
                {errorMessage && <p>{errorMessage}</p>}
                <Link href="/register">Don&apos;t have an account? Create one.</Link>
                <Pending />
            </form>
        </div>
    );
};

export default LoginPage;
