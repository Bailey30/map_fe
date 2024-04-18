"use client";
import clsx from "clsx";
import styles from "../../(auth)/auth.module.scss";
import UseFormyBoi from "@/utils/useFormyBoi";
import { useEffect } from "react";
import { hasErrors, validate } from "@/utils/formValidator";
import FormButton from "@/components/formButton/formButton";
import { warn } from "console";

export default function NewPasswordPage() {
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
            // mustMatchField: "password",
        },
    ]);

    useEffect(() => {
        console.log({ errors });
    }, [errors]);

    useEffect(() => {
        console.log({ values });
    }, [values]);

    function buttonTest(e: any) {
        e.preventDefault();
        validators();
        console.log("vutton est");
    }

    return (
        <div className={clsx(styles.pageContainer)}>
            <form className={clsx(styles.form)}>
                <input
                    name="test"
                    value={values.test}
                    onBlur={validators}
                    onChange={setValue}
                    className={clsx(errors?.test && styles.error)}
                />
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
                <FormButton
                    onClick={buttonTest}
                    disabled={hasErrors(errors)}
                    text="test button"
                />
            </form>
        </div>
    );
}
