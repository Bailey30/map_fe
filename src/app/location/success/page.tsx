import Link from "next/link"
import styles from "../review.module.scss"
export default function Page({ searchParams }: { searchParams: { action: string, location: string } }) {
    console.log({ searchParams })
    return (
        <div className={styles.success}>
            {searchParams.action === "update" ?
                <p>Review successfully updated 🍺</p> :
                <p>Guinness successfully added 🍺</p>
            }
            <Link href={`/location/${searchParams.location}`} className={styles.close}>Back</Link>
        </div>
    )
}
