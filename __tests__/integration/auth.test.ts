import { register } from "../../src/lib/user_server_actions"
import prisma from "../helpers/prisma"
import printDb from "../helpers/print-db"
import resetDb from "../helpers/reset-db"
// jest.mock("next-auth")
// jest.mock("next-auth/providers/credentials")
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    redirect: jest.fn()
}))

// import nextAuth from "next-auth"
describe("auth tests", () => {
    beforeEach(async () => {
        console.log("what was in the database before this test vvvvvvvvvvvv")
        await printDb()
        await resetDb()
    })
    afterAll(async () => {
        await prisma.$disconnect()
    })

    describe("register tests", () => {

        const mockFormData = new FormData()
        mockFormData.append("username", "John4")
        mockFormData.append("email", "john4@email.com")
        mockFormData.append("password", "password")
        mockFormData.append("passwordRepeat", "password")

        it("Should register a new user", async () => {
            const response = await register("", mockFormData)

            console.log({ response })

            const newUser = await prisma.user.findFirst()

            expect(response!.body!.user).toStrictEqual(newUser)
        })

        test("Should return success: false with errors object when missing fields", async () => {
            const partialFormData = new FormData()
            const response = await register("", partialFormData)

            const newUser = await prisma.user.findFirst()

            expect(response.errors.username).toEqual("username is required")
            expect(response.errors.password).toEqual("password is required")
            expect(response.errors.email).toEqual("email is required")
            expect(newUser).toEqual(null)
        })

        test("Should find user in database if given existing email", async () => {

            const user = await prisma.user.create({
                data: {
                    email: "john4@email.com",
                    password: "p",
                    username: "john"
                }
            })
            const response = await register("", mockFormData)

            expect(response.errors.email).toEqual("email already exists")

        })
        test("Should find user in database if given existing username", async () => {

            const user = await prisma.user.create({
                data: {
                    email: "john4@email.com",
                    password: "p",
                    username: "John4"
                }
            })
            const response = await register("", mockFormData)

            expect(response.errors.username).toEqual("username already exists")

        })
    })
})
