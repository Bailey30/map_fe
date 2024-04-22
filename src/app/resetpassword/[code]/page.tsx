"use client";
import clsx from "clsx";
import styles from "../../(auth)/auth.module.scss";
import UseFormyBoi from "@/utils/useFormyBoi";
import { hasErrors } from "@/utils/formValidator";
import FormButton from "@/components/formButton/formButton";
import { useFormState } from "react-dom";
import { resetPassword } from "@/lib/user_server_actions";
import { useEffect } from "react";
import Link from "next/link";

export default function NewPasswordPage({
  params,
}: {
  params: { code: string };
}) {
  const actionAndData = resetPassword.bind(null, { code: params.code });
  const [response, action] = useFormState(actionAndData, undefined);

  const { values, setValue, errors, validators } = UseFormyBoi([
    { name: "test", value: "", required: true },
    {
      name: "password",
      value: "",
      required: true,
    },
    {
      name: "repeatPassword",
      value: "",
      required: true,
      mustMatchField: {
        is: "password",
        customResponse: "Passwords do not match",
      },
    },
  ]);

  // function buttonTest(e: any) {
  //   e.preventDefault();
  //   validators();
  //   console.log("vutton est");
  // }

  useEffect(() => {
    console.log({ response });
  }, [response]);

  const buttonDisabled =
    hasErrors(errors) || values.password === "" || values.passwordRepeat === "";

  return (
    <div className={clsx(styles.pageContainer)}>
      {response?.success !== true && !response?.errors && (
        <form className={clsx(styles.form)} action={action}>
          <label htmlFor="password" id="password">
            New password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={values.password}
            onChange={setValue}
            onBlur={validators}
            className={clsx(errors?.password && styles.error)}
          />

          <label htmlFor="repeatPassword" id="repeatPassword">
            Repeat new password
          </label>
          <input
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            value={values.repeatPassword}
            onChange={setValue}
            onBlur={validators}
            className={clsx(errors?.repeatPassword && styles.error)}
          />
          {errors?.repeatPassword === "Passwords do not match" && (
            <p className={clsx(styles.error)} role="alert">
              {errors?.repeatPassword}
            </p>
          )}
          <FormButton disabled={buttonDisabled} text="Reset password" />
          <Link href="/" className={clsx(styles.back)}>
            Return to map
          </Link>
        </form>
      )}
      {response?.success === true && (
        <div className={`${styles.container}`}>
          <p className={`${styles.text}`}>
            Your password was successfully reset.
          </p>
          <p className={`${styles.text}`}>Return to the map and log in again</p>
          <Link href="/" className={clsx(styles.link)}>
            Return to map
          </Link>
        </div>
      )}
      {response?.errors && response.success === false && (
        <div className={`${styles.container}`}>
          <p className={`${styles.text}`}>Something went wrong</p>
          <p className={`${styles.text}`}>
            You&apos;re gonna need to request another password reset email 💅
          </p>
          <Link href="/resetpassword" className={clsx(styles.link)}>
            Get another email
          </Link>
        </div>
      )}
    </div>
  );
}
