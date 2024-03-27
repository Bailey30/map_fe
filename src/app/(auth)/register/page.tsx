"use client";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/lib/user_server_actions";
import styles from "../auth.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import { ServerActionResponse } from "@/utils/types";
import { Dispatch } from "redux";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [messages, serverAction]: [
    state: ServerActionResponse | undefined,
    dispatch: (payload: FormData) => void,
    isPending: boolean,
  ] = useFormState(register, undefined);

  console.log("register messages", messages);
  function back() {
    router.push("/");
  }
  useEffect(() => {
    if (messages?.success === true) {
      router.push("/");
    }
  }, [messages]);
  return (
    <div className={styles.pageContainer}>
      <button onClick={back}>Close</button>
      <form action={serverAction} className={styles.form}>
        <label htmlFor="username">username</label>
        <input type="text" name="username" />
        {messages?.errors?.username && <p>{messages?.errors.username}</p>}

        <label htmlFor="email">email</label>
        <input type="text" name="email" />
        {messages?.errors?.email && <p>{messages?.errors?.email}</p>}

        <label htmlFor="password">password</label>
        <input type="password" name="password" />
        {messages?.errors?.password && <p>{messages?.errors?.password}</p>}

        <label htmlFor="passwordRepeat">type password again</label>
        <input type="password" name="passwordRepeat" />

        <button type="submit">Register</button>
        <Link href="/login">Already have an account? Log in.</Link>
        <Pending />
      </form>
    </div>
  );
}
