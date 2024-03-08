// import { HttpResponse, http } from "msw"
// import { setupServer } from "msw/node"
import { beforeAll, afterEach, afterAll } from "@jest/globals"
import Page from "./page"
import { render, getByTestId, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import nock from "nock"

const reviewUrl = process.env.NEXT_PUBLIC_URL as string
// const server = setupServer(
//     http.get(reviewUrl, () => {
//         // 2. Return a mocked "Response" instance from the handler.
//         return HttpResponse.text('Hello world!')
//     }),
// )


// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())


test("handles server error", async () => {
    // server.use(
    //     http.get(reviewUrl, () => {
    //         return new HttpResponse(null, { status: 500 })
    //     })
    // )
    //
    console.log("reviewurl",reviewUrl)
    // const scope = nock(reviewUrl)
    // .get("/api/location")
    //     .reply(200)

    const props = {params: {slug: "1"}}
    const p = await Page(props)
    render(p)



    const element = screen.getByTestId("location-name") as HTMLDivElement

    expect(element).toHaveTextContent("carbrook")

})
