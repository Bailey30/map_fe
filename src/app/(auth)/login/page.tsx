"use client";
import {  login } from "@/lib/user_server_actions";
import { auth, signIn } from "@/lib/auth";
import React, { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import styles from "../auth.module.css"

const LoginPage = () => {
    const [errorMessage, dispatch] = useFormState(login, undefined);
    const { pending } = useFormStatus();

    useEffect(() => {
        console.log("login error", errorMessage);
    }, [errorMessage]);

    return (
        <div className={styles.pageContainer}>
            <form action={dispatch} className={styles.form}>
                <input type="text" placeholder="email" name="email" />
                {/* <input type="email" placeholder="email" name="email" /> */}
                <input type="password" placeholder="password" name="password" />
                <button type="submit" aria-disabled={pending}>
                    Log in
                </button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default LoginPage;