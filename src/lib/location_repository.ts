import { MapState } from "@/redux/slice"
import { Location } from "../utils/types"

export async function createLocation(coordinates: MapState, name: string, tx: any): Promise<Location> {
    try {
        const location = await tx?.location.create({
            data: {
                name: name,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
        })
        return location
    } catch (error: any) {
        console.log("error creating location", error)
        throw new Error("error creating location", error)
    }
}

export async function getLocation(id: string, tx: any): Promise<Location> {
    try {
        const location = await tx?.location.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return location
    } catch (error: any) {
        console.log("error getting location", error)
        throw new Error("error creating location", error)
    }
}

export async function deleteLocation(id: number): Promise<boolean> {
    try {
        await prisma?.location.delete({
            where: {
                id: id
            }
        })
        return true
    } catch (err: any) {
        throw new Error("error deleting location", err)
    }
}
