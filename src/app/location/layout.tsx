import ScrollContainer from "@/components/scrollContainer/scrollContainer"
import styles from "./review.module.scss"

export default function LocationLayout({ children }: {
    children: React.ReactNode
}) {

    return <ScrollContainer id="scroll">
        <div className={styles.infoPanel} id="info">
            <div className={styles.dragHandle}></div>
            {children}
        </div>
    </ScrollContainer>
}
