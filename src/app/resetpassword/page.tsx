"use client";

import close from "../../../public/images/close.png";
import Image from "next/image";
import clsx from "clsx";
import styles from "../(auth)/auth.module.scss";
import { useFormState } from "react-dom";
import { sendPasswordResetEmail } from "@/lib/user_server_actions";
import FormButton from "@/components/formButton/formButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [response, dispatch, __] = useFormState(
    sendPasswordResetEmail,
    undefined,
  );

  useEffect(() => {
    if (response?.success === true) {
      setEmailSent(true);
    }
  }, [response]);

  function navigate(path: string) {
    router.push(path);
  }

  return (
    <div className={clsx(styles.pageContainer)}>
      <button onClick={() => navigate("/")} className={`${styles.close}`}>
        <Image
          className={`${styles.x}`}
          src={close}
          height={30}
          width={30}
          alt="Close button icon"
        />
      </button>

      {!emailSent && (
        <form action={dispatch} className={clsx(styles.form)}>
          <h1>Forgot your password?</h1>
          <p className={clsx(styles.instruction)}>
            Enter your email to receive a link to change your password
          </p>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email address"
          />

          <FormButton text={"Send link"} />
          <p
            className={clsx(styles.back, styles.fade)}
            onClick={() => navigate("/login")}
          >
            Back
          </p>
        </form>
      )}
      {emailSent && (
        <form className={styles.form}>
          <h1>Email sent!</h1>
          <p>
            If there is an account associated with the email you entered,
            you&apos;ll receive a link to reset your password.
          </p>
          <p className={clsx(styles.instruction)}>
            Make sure to check your junk or spam folders.
          </p>
          <p className={clsx(styles.back)} onClick={() => setEmailSent(false)}>
            Send another email
          </p>
        </form>
      )}
    </div>
  );
}
