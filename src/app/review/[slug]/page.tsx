import styles from "../review.module.css"


async function getReviews(id: string) {
console.log("calling get reviews")
    const res = await fetch("http://localhost:3000/api/review/"+ id)
}

export default async function GetReviewPanel({ params }: { params: { slug: string } }) {
    console.log("get reivew panale", { params })
    const locationId = params.slug
    const locationAndReviews = await getReviews(locationId)
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
