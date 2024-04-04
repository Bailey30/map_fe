"use client";
import styles from "./welcomePopup.module.scss";
import clsx from "clsx";
import Image from "next/image";
import close from "../../../public/images/close.png";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import navbarStyles from "../navbar/navbar.module.scss";
import reviewDisplayStyles from "../reviewsDisplay/reviewsDisplay.module.scss";
import guinness from "../../../public/images/guinness.png";

export default function WelcomePopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!buttonRef.current) return;
    buttonRef.current.setAttribute("autofocus", "true");
    const dialog = document.querySelector("dialog");
    const closeButton = document.querySelector("dialog button");

    if (
      localStorage.getItem("hasSeenWelcomePopup") !== "true" &&
      pathname === "/"
    ) {
      dialog?.showModal();
    }

    closeButton?.addEventListener("click", () => {
      dialog?.close();
    });

    localStorage.setItem("hasSeenWelcomePopup", "true");
  }, []);

  function linkClick() {
    if (!dialogRef.current) return;

    // dialogRef.current.close();
  }

  return (
    <dialog className={clsx(styles.dialog)} ref={dialogRef}>
      <h1>Welcome to the Guinness Map!</h1>
      <p className={clsx(styles.one)}>
        Click the big circle in the bottom right to review a Guinness at a new
        location:
      </p>
      <span>
        <div className={clsx(navbarStyles.addButton, styles.bigAddButton)}>
          <>
            +
            <Image
              src={guinness.src}
              alt="Guinness icon"
              height={30}
              width={30}
            />{" "}
          </>
        </div>
      </span>
      <p className={clsx(styles.two)}>
        Click a pint glass on the map to see reviews at an existing location and
        then add your own:
      </p>
      <span>
        <div
          className={clsx(
            reviewDisplayStyles.button,
            reviewDisplayStyles.add,
            styles.addButton,
          )}
        >
          Add
          <Image
            src={guinness.src}
            alt={"Guinness icon on add button"}
            height={30}
            width={30}
          />
        </div>
      </span>
      <p className={clsx(styles.account)}>
        (You need to{" "}
        <a href="/register" onClick={linkClick}>
          create an account
        </a>{" "}
        before you leave a review)
      </p>
      <div className={clsx(styles.buttonContainer)}>
        <button ref={buttonRef}>Get to the Guinnesses</button>
      </div>
      <Link
        className={clsx(styles.source)}
        href="https://www.github.com/bailey30/map_fe"
        target="_blank"
      >
        Source code 👀
      </Link>
    </dialog>
  );
}
