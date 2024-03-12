import { screen } from "@testing-library/react"
import { render } from "@/utils/testUtils";
import userEvent from "@testing-library/user-event"
import Page from "./page"
import { useRouter } from "next/navigation";
import { createReviewSQL } from "@/lib/server_actions";

// to reomove error: invariant expect app router to be mounted
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        }
    }
}))

import { useFormState } from "react-dom";


// const reviewData = {
//     mapState: { longitude: 0, latitude: 0, zoom: 0 },
//     imageData: "",
// }
// const createReviewWithLocation = createReviewSQL.bind(null, reviewData)
// // const [message, formAction] = useFormState(createReviewWithLocation, null)
// jest.mock("react-dom", () => {
//     const mockUseFormState = jest.fn(() => { return ["message", "formAction"] })
//     const [message, formAction] = mockUseFormState()
// })
// // return {
// //     Events: {},
// //     useFormState: () => [null, () => { }]
// // }
// // const [message, formAction] = useFormState(createReviewWithLocation, null)

describe("Create Location form", () => {

    let location_input: HTMLInputElement;
    let price_input: HTMLInputElement
    let rating_input;
    let star_five: HTMLImageElement
    let save_button: HTMLButtonElement

    function setup() {
        render(<Page />)
        location_input = screen.getByLabelText("Location")
        price_input = screen.getByLabelText("Price")
        rating_input = screen.getByLabelText("Rating")
        star_five = screen.getByTestId("star_five")

    }
    test("Should submit form and show success page when fields are filled correctly", async () => {
        // setup()
        // const user = userEvent.setup()
        // const success_message = screen.getByText("Guinness successfully added 🍺")
        //
        // await user.type(location_input, "Location")
        // await user.type(price_input, "1")
        // await user.click(star_five)
        // // await user.click(save_button)
        //
        // expect(success_message).toBeInTheDocument()




    })
})
