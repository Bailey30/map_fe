import styles from "../review.module.css"
export default function GetReviewPanel() {
    // server action?
    return (
        <div className={styles.infoPanel}>
        <div>one review</div>
            <label htmlFor="location">Location</label>
            <input name="location"></input>
            <label htmlFor="price">price</label>
            <input name="price" type="number"></input>
            <label htmlFor="rating">rating</label>
            <input name="rating" type="number" />
            <label htmlFor="comments">comments</label>
            <input type="text" />
            <div className={styles.buttonContainer}>

                <button className={styles.save}>Save</button>
                <button className={styles.cancel}>Cancel</button>
            </div>
        </div>
    )
}
