import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
    await prisma.$transaction([
        // prisma.location.deleteMany(),
        // prisma.review.deleteMany(),
        prisma.user.deleteMany()
    ])
}
