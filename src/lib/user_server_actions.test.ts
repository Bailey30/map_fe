import * as userUtils from "@/utils/userUtils"
import { generatePassword } from "@/utils/userUtils"; // Import generatePassword
import { redirect } from "next/navigation"
import { prismaMock } from "./__mocks__/db";
import { register } from "./user_server_actions";

jest.mock("./db")
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    redirect: jest.fn()
}))

jest.mock('../utils/userUtils', () => ({
    ...jest.requireActual('../utils/userUtils'),
    generatePassword: jest.fn(), // Mocking the generatePassword function
}))

describe("user_server_actions tests", () => {
    beforeEach(() => {
        jest.restoreAllMocks()
    })

    const mockFormData = new FormData()
    mockFormData.append("username", "John")
    mockFormData.append("email", "john@email.com")
    mockFormData.append("password", "password")
    mockFormData.append("passwordRepeat", "password")

    test("should register a new user and return success", async () => {
        const user = { email: "test@email.com", username: "John", password: "password", id: 1 };

        // mock the value from findUser() with null - simulate no existing user
        prismaMock.user.findFirst.mockResolvedValue(null);

        // mock the value from generatePassword() // NOT NEEDED IT SEEMS
        // (generatePassword as jest.Mock).mockResolvedValue("password")

        // mock creating a user successfully
        prismaMock.user.create.mockResolvedValue({ ...user })

        //call the function being tested
        await register("", mockFormData)

        // test that it directs successfully
        expect((redirect)).toHaveBeenCalledWith("/")
    })

})
