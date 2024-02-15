import { number } from "zod"

export type Review = {
    id: string,
    createdAt: string,
    updatedAt: string,
    price: number,
    comments: string,
    rating: number,
    locationId: number,
    creatorId: number
}

export type ReviewRequest = Omit<Review, "id">

export type Location = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    Review: Review[]
}

export type InputErrors ={
    username?: string |undefined
    password?: string |undefined
    email?: string |undefined
}
