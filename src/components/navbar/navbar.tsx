"use client";
import styles from "./navbar.module.scss";
import guinness from "../../../public/images/guinness.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { logOut } from "@/lib/user_server_actions";
import settings from "../../../public/images/settings.png";
import clsx from "clsx";
import SettingsDropdown from "../settingsDropdown/settingsDropdown";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_SHOW_CONTROLS } from "@/redux/controlsSlice";

interface Props {
  session: Session | null;
}

export default function Navbar({ session }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const showControls = useAppSelector((state) => state.controls.showControls);
  const isNotOnAddPage = !pathname.includes("/add");

  function onClick() {
    console.log(pathname);

    if (pathname.includes("/add")) {
      router.push("/");
    } else {
      router.push("/add");
    }
  }

  return (
    <div className={styles.addButtonContainer} role="menubar">
      <div className={styles.topBarButtons}>
        {isNotOnAddPage && (
          <>
            <button
              className={clsx(styles.settings)}
              onClick={() => dispatch(SET_SHOW_CONTROLS(!showControls))}
              type="button"
              tabIndex={0}
              aria-expanded={showControls}
              aria-haspopup="menu"
              aria-control="settingsDropdown"
              id="settingsDropdownButton"
            >
              <Image
                src={settings}
                alt="Settings icon"
                width={20}
                height={20}
              />
            </button>
            <SettingsDropdown session={session} show={showControls} />
          </>
        )}
        {!session ? (
          <Link href="/login" role="presentation" className={styles.addButton}>
            <>
              +
              <Image
                src={guinness.src}
                alt="Guinness icon"
                height={30}
                width={30}
              />{" "}
            </>
          </Link>
        ) : (
          <>
            <button
              onClick={onClick}
              className={clsx(
                styles.addButton,
                !isNotOnAddPage && styles.isAdding,
              )}
            >
              {isNotOnAddPage ? (
                <>
                  +
                  <Image
                    src={guinness.src}
                    alt="Guinness icon"
                    height={30}
                    width={30}
                  />{" "}
                </>
              ) : (
                "Cancel"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
