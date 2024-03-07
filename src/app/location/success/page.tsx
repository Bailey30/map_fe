import Link from "next/link"
import styles from "../review.module.scss"
export default function Page() {
    return (
        <div className={styles.success}>
            <p>Guinness successfully added 🍺</p>
            <Link href="/" className={styles.close}>Close</Link>
        </div>
    )
}
