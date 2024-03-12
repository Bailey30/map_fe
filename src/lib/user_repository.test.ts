import { prismaMock } from "./__mocks__/db";
import { createUser, findUser } from "./user_repository";

jest.mock("./db")

test("createUser should return the generated user", async () => {
    const newUser = { email: "test@email.com", username: "John", password: "password" }

    prismaMock.user.create.mockResolvedValue({ ...newUser, id: 1 })

    const user = await createUser(newUser)

    expect(user).toStrictEqual({ ...newUser, id: 1 })
})

test("findUser should return user if they exist", async () => {
    // only tests that the function does the most basic thing - that it returns what it is told to return
    const user = { email: "test@email.com", username: "John", password: "password", id: 1 }

    prismaMock.user.findFirst.mockResolvedValue(user)

    const foundUser = await findUser(user.email, user.username)

    expect(foundUser).toStrictEqual(user)
})
