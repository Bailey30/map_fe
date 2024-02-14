import prisma from "@/lib/db"
import { Location } from "@/utils/types";
import { NextResponse } from "next/server";

type reviewResponse = ({
    Review: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        comments: string | null;
        rating: number;
        locationId: number;
        creatorId: number;
    }[];
} & {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
})[]

type reviewRouteResponse = { reviews: reviewResponse, status: number } | { error: string, status: number }
export const GET = async (): Promise<NextResponse<reviewRouteResponse>> => {
    try {
        const reviews: reviewResponse = await prisma?.location.findMany({
            include: { Review: true }
        })
        return NextResponse.json({ reviews, status: 200 })
    } catch (error) {
        console.log("failed to fetch posts");
        return NextResponse.json({ error: "failed to fetch posts", status: 500 });
    }
};
