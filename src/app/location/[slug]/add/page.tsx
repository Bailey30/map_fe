import AddNewReviewToLocation from "@/components/addReviewToLocation/addReviewToLocation"

export default function Page({ params, searchParams }: {
    params: { slug: string }
    searchParams: { [key: string]: string }
}) {
    console.log({ searchParams })
    return <>
        <AddNewReviewToLocation locationId={params.slug} locationName={searchParams.location} />
    </>
}
