import prisma from "@/lib/db"
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse<{}>> => {
    try {
        const reviews = await prisma?.location.findMany({
            include: {Review: true}
        })
        console.log({ reviews })
        return NextResponse.json({ reviews, status: 200 })
    } catch (error) {
        console.log("failed to fetch posts");
        return NextResponse.json(
            { error: "failed to fetch posts" },
            { status: 500 }
        );
    }
};
