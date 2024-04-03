"use client";
import styles from "./add.module.scss";
import Link from "next/link";
import GuinnessMarker from "@/components/guinnessMarker/guinessMarker";
import guinness from "../../../public/images/guinness.png";
import Image from "next/image";
import clsx from "clsx";

export default function AddingOverlay() {
  return (
    <div className={styles.addingOverlayContainer}>
      <GuinnessMarker />
      <p className={styles.instructions}>
        Move the map to the correct location
      </p>
      <div className={clsx(styles.containerBg)}></div>
      <div className={clsx(styles.buttonContainer)}>
        <Link href="/location" className={styles.saveButton}>
          Add
          <Image
            src={guinness.src}
            alt="Guinness icon"
            height={30}
            width={30}
          />
        </Link>
        <Link href="/" className={styles.cancelButton}>
          Cancel
        </Link>
      </div>
    </div>
  );
}
