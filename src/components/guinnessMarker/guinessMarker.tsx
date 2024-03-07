import styles from "./guinnessMarker.module.scss"
import guinness from "../../../public/images/guinness.png"
import arrow from "../../../public/images/guinness_arrow.png"
import Image from "next/image"

export default function GuinnessMarker(){
            return <Image src={arrow} alt={"guinness marker"} className={styles.marker} />
}
