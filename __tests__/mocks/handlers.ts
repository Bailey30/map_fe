import { HttpResponse, http } from "msw"

export const handlers = [
    http.post("/Prod/image/", async ({ request, params, cookies }) => {
        console.log({ request })
        console.log({ params })
        return HttpResponse.json({ data: { uploadUrl: "mockSignedUrl" } })
    }),
    http.post("mockSignedUrl", () => {
        return new HttpResponse(null, { status: 200 })
    })
]
