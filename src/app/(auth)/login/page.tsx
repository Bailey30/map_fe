"use client";
import { login } from "@/lib/user_server_actions";
import close from "../../../../public/images/close.png";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import styles from "../auth.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import Image from "next/image";
import FormButton from "@/components/formButton/formButton";
import clsx from "clsx";

const LoginPage = () => {
  const router = useRouter();
  const [errorMessage, dispatch, _] = useFormState(login, undefined);

  useEffect(() => {
    console.log("login error", errorMessage);
  }, [errorMessage]);

  function back() {
    router.push("/");
  }

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
      <form action={dispatch} className={styles.form}>
        <input type="text" placeholder="email" name="email" />
        {/* <input type="email" placeholder="email" name="email" /> */}
        <input type="password" placeholder="password" name="password" />
        <FormButton text={"Log in"} />
        {errorMessage && (
          <p className={clsx(styles.error)} role="alert">
            {errorMessage}
          </p>
        )}
        <Link href="/register">Don&apos;t have an account? Create one.</Link>
        <Link href="/resetpassword" className={styles.password}>
          Forgot your password?
        </Link>
        <Pending />
      </form>
    </div>
  );
};

export default LoginPage;
