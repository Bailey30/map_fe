import Link from "next/link";
import styles from "../review.module.scss";
export default function Page({
  searchParams,
}: {
  searchParams: { action: string; location: string };
}) {
  console.log({ searchParams });
  return (
    <div className={styles.success}>
      {searchParams.action === "update" ? (
        <p>Review successfully updated 🍺</p>
      ) : (
        <p>Guinness successfully added 🍺</p>
      )}
      {searchParams.location ? (
        <Link
          href={`/location/${searchParams.location}`}
          className={styles.close}
        >
          Back
        </Link>
      ) : (
        <Link href={`/`} className={styles.close}>
          Close
        </Link>
      )}
    </div>
  );
}
