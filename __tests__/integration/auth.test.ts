import { register } from "../../src/lib/user_server_actions"
import prisma from "../helpers/prisma"
import printDb from "../helpers/print-db"
import resetDb from "../helpers/reset-db"
jest.mock("next-auth")
jest.mock("next-auth/providers/credentials")
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    redirect: jest.fn()
}))

import nextAuth from "next-auth"
describe("auth tests", () => {
    beforeEach(async () => {
        console.log("what was in the database before this test vvvvvvvvvvvv")
        await printDb()
        await resetDb()
    })
    const mockFormData = new FormData()
    mockFormData.append("username", "John4")
    mockFormData.append("email", "john4@email.com")
    mockFormData.append("password", "password")
    mockFormData.append("passwordRepeat", "password")
    it("Should register a new user", async () => {
        const response = await register("", mockFormData)

        const newUser = await prisma.user.findFirst()

        expect(response!.body!.user).toStrictEqual(newUser)
    })
})
