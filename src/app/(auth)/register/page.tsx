"use client";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import close from "../../../../public/images/close.png";
import { login, register } from "@/lib/user_server_actions";
import styles from "../auth.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import { ServerActionResponse } from "@/utils/types";
import { Dispatch } from "redux";
import { useEffect } from "react";
import { isPending } from "@reduxjs/toolkit";
import FormButton from "@/components/formButton/formButton";
import clsx from "clsx";

export default function RegisterPage() {
  const router = useRouter();
  const [messages, serverAction, _]: [
    state: ServerActionResponse | undefined,
    dispatch: (payload: FormData) => void,
    isPending: boolean,
  ] = useFormState(register, undefined);

  function back() {
    router.push("/");
  }

  useEffect(() => {
    if (messages?.success === true) {
      const { email, password } = messages!.body!.user;
      const formData = new FormData();
      formData.append("password", password);
      formData.append("email", email);

      login("", formData).then(() => {
        console.log("Redirecting to / after logging in");
      });
    }
  }, [messages]);

  return (
    <div className={styles.pageContainer}>
      <button onClick={back} className={`${styles.close}`}>
        <Image
          className={`${styles.x}`}
          src={close}
          height={30}
          width={30}
          alt="Close button icon"
        />
      </button>
      <form action={serverAction} className={styles.form}>
        <label htmlFor="username">username</label>
        <input
          type="text"
          name="username"
          className={clsx(messages?.errors?.username && styles.error)}
        />
        {messages?.errors?.username && (
          <p className={clsx(styles.error)} role="alert">
            {messages?.errors?.username}
          </p>
        )}

        <label htmlFor="email">email</label>
        <input
          type="text"
          name="email"
          className={clsx(messages?.errors?.email && styles.error)}
        />
        {messages?.errors?.email && (
          <p className={clsx(styles.error)} role="alert">
            {messages?.errors?.email}
          </p>
        )}

        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          className={clsx(messages?.errors?.password && styles.error)}
        />
        {messages?.errors?.password && (
          <p className={clsx(styles.error)} role="alert">
            {messages?.errors?.password}
          </p>
        )}

        <label htmlFor="passwordRepeat">type password again</label>
        <input
          type="password"
          name="passwordRepeat"
          className={clsx(
            messages?.errors?.password &&
              messages?.errors?.password === "password does not match" &&
              styles.error,
          )}
        />
        <FormButton text={"Register"} />
        <Link href="/login">Already have an account? Log in.</Link>
        <Pending />
      </form>
    </div>
  );
}
