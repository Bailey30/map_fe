import styles from "./guinnessMarker.module.scss"
import guinness from "../../../public/images/guinness.png"
import Image from "next/image"

export default function GuinnessMarker(){
            return <Image src={guinness} alt={"guinness marker"} className={styles.marker} />
}
