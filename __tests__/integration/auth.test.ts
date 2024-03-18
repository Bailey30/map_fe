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
    // afterEach(async () => {
    //     await printDb()
    // })
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

        // expect(newUser).toEqual("gfjdk")

    })

    // NEED TO TEST WHY IT DOESNT RETURN ERRORS WHEN THEY EXIST
    // try removing the __mocks__ folder you created with duplicated the auth stuff
})
