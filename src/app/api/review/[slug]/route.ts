import { NextResponse } from "next/server";

export const GET = async () => {
    try {
    } catch (error) {
        console.log("failed to fetch posts");
        return NextResponse.json(
            { error: "failed to fetch posts" },
            { status: 500 }
        );
    }
};
