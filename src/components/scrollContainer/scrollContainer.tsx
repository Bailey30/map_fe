import styles from "./scrollContainer.module.scss"
export default function ScrollContainer({children}:any){
    return <div className={styles.scrollContainer}>{children}</div>
}
