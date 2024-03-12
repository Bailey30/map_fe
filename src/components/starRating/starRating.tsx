import { Dispatch, SetStateAction, useState } from "react"
import styles from "./starRating.module.scss"
import star from "../../../public/images/star.png"
import guinness from "../../../public/images/guinness.png"
import Image from "next/image"
import clsx from "clsx"

interface Props {
    setRatingInput: Dispatch<SetStateAction<number>>
}
export default function StarRating({ setRatingInput }: Props) {
    const [active, setActive] = useState<number>(0)
    const [rating, setRating] = useState<number[]>([1, 2, 3, 4, 5])

    function handleRating(i: number) {
        setActive(i)
        setRatingInput(i + 1)
    }

    return <div className={styles.ratingContainer}>
        {rating.map((rat, i) => {
            return <Image src={guinness} alt="rating star" height={25} width={25} onMouseEnter={() => handleRating(i)} onClick={() => handleRating(i)} className={clsx(styles.star, active >= i && styles.active)} key={rat} data-testid={i === 4 && "star_five"}/>
        })}
    </div>
}
