import nock from "nock"
import { setupServer } from "msw/node"
import uploadImage from "./uploadImage"
import { blobify } from "../utils/reviewUtils"
import { revalidateTag } from "next/cache"
import { http, HttpResponse } from 'msw'
import axios from 'axios';
import { server } from "../../__tests__/mocks/server"
// jest.mock("./uploadImage", () => ({
//     ...jest.requireActual("./uploadImage"),
// }))

jest.mock("next/cache", () => ({
    ...jest.requireActual("next/cache"),
    revalidateTag: jest.fn()
}))
jest.mock("../utils/reviewUtils", () => ({
    ...jest.requireActual("../utils/reviewUtils"),
    blobify: jest.fn()
}))

describe("Upload image tests", () => {
    beforeAll(() => {
        global.fetch = jest.fn();
    })

    // would have tested with MSW but it is not clear whether it functions correctly with Next.js. Gave up trying to solve the errors

    test("uploadImage() should upload and image and revalidate the 'images' tag", async () => {
        const mockSignedUrl = "http://mockSignedUrl/";
        const base64Data = "data:image/jpeg;base64,/9j/4AA";
        (blobify as jest.Mock).mockResolvedValueOnce(new Blob(["mocked blob"]))

        const mockedSignedUrlResponse = {
            uploadUrl: "uploadUrl"
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({ json: async () => (mockedSignedUrlResponse) });

        (global.fetch as jest.Mock).mockResolvedValueOnce({ json: async () => ({ body: true }) })

        const result = await uploadImage(base64Data, "locationName", 1)
        expect(revalidateTag).toHaveBeenCalledWith("images")
    })

})
