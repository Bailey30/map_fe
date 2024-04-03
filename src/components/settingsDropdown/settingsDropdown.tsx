"use client";
import eye from "../../../public/images/eye.png";
import { logOut } from "@/lib/user_server_actions";
import styles from "./settingsDropdown.module.scss";
console.log({ styles });
import clsx from "clsx";
import Image from "next/image";
import tick from "../../../public/images/tick.svg";
import { Session } from "next-auth";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_RECENT_PRICE } from "@/redux/controlsSlice";
import { useEffect, useState } from "react";
import PriceRange from "../priceRange/priceRange";

interface Props {
  session: Session | null;
  show: boolean;
}

export default function SettingsDropdown({ session, show }: Props) {
  const recentPrice = useAppSelector((state) => state.controls.recentPrice);
  const dispatch = useAppDispatch();
  const [showDisplayOptions, setShowDisplayOptions] = useState<boolean>(false);

  // close when losing focus for accessibility?
  function handleFocus() {
    console.log("on blur");
  }

  useEffect(() => {
    console.log({ recentPrice });
  }, [recentPrice]);

  // <li onBlur={handleFocus} onFocus={() => console.log("focus")}>
  //   <button
  //     role="menuitem"
  //     id="displayOptionsButton"
  //     aria-haspopup="menu"
  //     aria-controls="displayOptions"
  //     onClick={() => setShowDisplayOptions(!showDisplayOptions)}
  //     aria-expanded={showDisplayOptions}
  //   >
  //     <Image
  //       src={eye}
  //       width={30}
  //       height={20}
  //       alt="Display settings icon"
  //     />
  //   </button>
  // </li>
  return (
    <div
      className={clsx(styles.settingsDropdown, show && styles.show)}
      aria-labelledby="settingsDropdownButton"
      role="menu"
      id="settingsDropdown"
      aria-label="Settings dropdown"
      data-testid="settingsDropdownId"
    >
      <ul>
        <li role="presentation" tabIndex={-1}>
          {session ? (
            <form action={logOut}>
              <button className={styles.addButton} role="menuitem">
                Log out
              </button>
            </form>
          ) : (
            <Link href={"/login"}>Log in</Link>
          )}
        </li>
        <li>
          <label
            htmlFor="recentPrice"
            className={clsx(styles.recentPriceLabel)}
          >
            Recent price
          </label>
          <input
            type="checkbox"
            id="recentPrice"
            name="recentPrice"
            role="checkbox"
            aria-checked={recentPrice}
            onClick={() => dispatch(SET_RECENT_PRICE(!recentPrice))}
          />
          <span className={clsx(styles.checkmark)}>
            <Image src={tick.src} alt="Tick icon" height={11} width={11} />
          </span>
        </li>
        <li>
          <PriceRange />
        </li>
      </ul>

      {showDisplayOptions && (
        <div className={clsx(styles.displayOptions)}>
          <ul
            id="displayOptions"
            role="menu"
            aria-labelledby="displayOptionsButton"
            aria-label="Display options dropdown"
          ></ul>
        </div>
      )}
    </div>
  );
}
