import prisma from "../../../../lib/db"
import { NextResponse } from "next/server";

type reviewsResponse = ({
    Review: ({
        creator: {
            username: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        comments: string | null;
        rating: number;
        locationId: number;
        creatorId: number;
    })[];
} & {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}) | null

type reviewRouteResponse = {status: number, location: reviewsResponse} | {status:number, error: string}

export const GET = async (request: Request, { params }: { params: { slug: string } }): Promise<NextResponse<reviewRouteResponse>> => {
    console.log("in one location get request")
    console.log({ params })
    try {
        const id = params.slug
        console.log("id in one location get request: ", id)
        const reviews = await prisma.location.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                Review: {
                    include: {
                        creator: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        })
        console.log("reviews", reviews)
        return NextResponse.json({ status: 200, location: reviews })
    } catch (error) {
        console.log("failed to fetch posts");
        return NextResponse.json(
            { error: "failed to fetch posts" ,
             status: 500 }
        );
    }
};
