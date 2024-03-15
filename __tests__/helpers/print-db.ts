
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
    await prisma.$transaction(async (tx) => {

        const locations = await tx.location.findMany()
        const reviews = await tx.review.findMany()
        const users = await tx.user.findMany()

        console.log({ locations })
        console.log({ reviews })
        console.log({ users })
    })

}
