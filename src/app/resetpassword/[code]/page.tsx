"use client";
import clsx from "clsx";
import styles from "../../(auth)/auth.module.scss";
import UseFormyBoi from "@/utils/useFormyBoi";
import { useEffect } from "react";

export default function NewPasswordPage() {
  const { values, setValue, errors, validators } = UseFormyBoi([
    {
      name: "password",
      value: "",
      required: true,
    },
    {
      name: "repeatPassword",
      value: "",
      required: true,
      mustMatchField: "password",
      // create "mustMatch" validator
    },
  ]);

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  useEffect(() => {
    console.log({ values });
  }, [values]);

  return (
    <div className={clsx(styles.pageContainer)}>
      <form className={clsx(styles.form)}>
        <label htmlFor="password" id="password">
          New password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={values.password}
          onChange={setValue}
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
        />
      </form>
    </div>
  );
}
