"use client";
import styles from "./navbar.module.scss";
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
        if (pathname.includes("/location")) {
        }
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
                            className={clsx(styles.addButton, styles.settings)}
                            onClick={() => dispatch(SET_SHOW_CONTROLS(!showControls))}
                            type="button"
                            tabIndex={0}
                            aria-expanded={showControls}
                        >
                            <Image
                                src={settings}
                                alt="Settings icon"
                                width={20}
                                height={20}
                                aria-haspopup="menu"
                                aria-control="settingsDropdown"
                                id="settingsDropdownButton"
                            />
                        </button>
                        {showControls && (
                            <SettingsDropdown session={session} />
                        )}
                    </>
                )}
                {!session ? (
                    <Link href="/login" role="presentation" className={styles.addButton}>
                        Login to add guinnesses
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
                            {isNotOnAddPage ? "Add new Guinness location" : "Cancel"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
