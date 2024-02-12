export type Review = {
    id: string,
    location: string
    price: number,
    rating: number,
    latitude: number,
    longitude: number
}

export type ReviewRequest = Omit<Review, "id">
