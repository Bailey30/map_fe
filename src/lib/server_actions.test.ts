import { Location, ReviewData } from "@/utils/types";
import { prismaMock } from "./__mocks__/db";
import { auth } from "./auth"
import { createReviewSQL, deleteReviewAction } from "./server_actions";
import { revalidateTag } from "next/cache";


jest.mock("./db")
jest.mock("./auth.ts", () => ({
    ...jest.requireActual("./auth.ts"),
    auth: jest.fn()
}))
jest.mock("next/cache", () => ({
    ...jest.requireActual("next/cache"),
    revalidateTag: jest.fn()
}))



describe("server_actions tests", () => {
    beforeEach(() => {
        jest.restoreAllMocks()
    })

    const mockFormData = new FormData()
    mockFormData.append("location", "mock_location")
    mockFormData.append("price", "1")
    mockFormData.append("rating", "1")

    // const { auth } = NextAuth()
    const user = { email: "mocked@email.com", username: "John", password: "password", id: 1 };
    const mockCreatedLocation: Location = { id: 1, name: "mocked_location", longitude: 1, latitude: 1, Review: null }
    const mockCreatedReview = { id: 1, locationId: 1, creatorId: 1, rating: 1, price: 1, comments: "", createdAt: new Date(), updatedAt: new Date(), imageId: 0 }

    const mockReviewData: ReviewData = {
        mapState: { longitude: 1, latitude: 1, zoom: 1 }
    }

    test("CreateReviewSQL should create a new location and review if no location id given", async () => {
        // mock auth response
        (auth as jest.Mock).mockResolvedValue({ user: { email: "mocked@email.com" } })

        // mock finding logged in user
        prismaMock.user.findFirst.mockResolvedValue(user)

        // mock the prisma transaction
        prismaMock.$transaction.mockImplementationOnce(
            callback => callback(prismaMock)
        )

        // mock successful creation of location
        prismaMock.location.create.mockResolvedValue(mockCreatedLocation)

        // mock successful creation of review
        prismaMock.review.create.mockResolvedValue(mockCreatedReview)

        // mock revalidating tag - at top of file

        // mock calling actual function
        const response = await createReviewSQL(mockReviewData, "", mockFormData)

        // assert expected answer
        expect(response).toStrictEqual({ success: true, errors: null, action: "New location mocked_location added with review." })
    })

    test("CreateReviewSQL should add a review to an existing location when given a location id", async () => {

        // mock auth response
        (auth as jest.Mock).mockResolvedValue({ user: { email: "mocked@email.com" } })

        // mock finding logged in user
        prismaMock.user.findFirst.mockResolvedValue(user)

        // mock the prisma transaction
        prismaMock.$transaction.mockImplementationOnce(
            callback => callback(prismaMock)
        )

        // mock successful creation of location
        const mockExistingLocation: Location = { id: 1, name: "mocked_location", longitude: 1, latitude: 1, Review: null }
        prismaMock.location.findUnique.mockResolvedValue(mockExistingLocation)

        // mock successful creation of review
        prismaMock.review.create.mockResolvedValue(mockCreatedReview)

        // mock revalidating tag - at top of file

        // mock calling actual function
        mockFormData.append("id", "1")
        const response = await createReviewSQL(mockReviewData, "", mockFormData)

        // assert expected answer
        expect(response).toStrictEqual({ success: true, errors: null, action: "Review added to location: mocked_location." })
    })

    // test for input errors
    //

    const deleteReviewData = {
        reviewId: 1,
        locationId: 1
    }

    test("DeleteReview() should delete review", async () => {

        prismaMock.review.delete.mockResolvedValue(mockCreatedReview)
        prismaMock.review.findMany.mockResolvedValue([mockCreatedReview, mockCreatedReview])

        const response = await deleteReviewAction(deleteReviewData, "", mockFormData)

        expect(response).toEqual({ success: true, action: "Successfully deleted review" })

    })

    test("DeleteReview() should delete the location if the last review is deleted", async () => {
        prismaMock.review.delete.mockResolvedValue(mockCreatedReview)
        prismaMock.review.findMany.mockResolvedValue([])

        const response = await deleteReviewAction(deleteReviewData, "", mockFormData)

        expect(response).toEqual(({ success: true, action: "Successfully deleted last review and location", redirect: true }))
    })

    const updateReviewData = {
        reviewId: 1
    }
    const updateReviewFormData = {
        price: 2,
        rating: 2,
    }

    const updatedReview = { id: 1, locationId: 1, creatorId: 1, rating: 1, price: 1, comments: "", createdAt: new Date(), updatedAt: new Date(), imageId: 0 }
    test("Update review should update the correct review and return success", async () => {
        prismaMock.review.update.mockResolvedValue(updatedReview)
        const response = await updateReviewAction(updateReviewData, "", updateReviewFormData)


    })
})
