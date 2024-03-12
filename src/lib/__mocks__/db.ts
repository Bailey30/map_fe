import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
// import { beforeEach } from '@jest/globals';
import prisma from '../db'

jest.mock('../db', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

beforeEach(() => { mockReset(prismaMock) })

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// The singleton file tells Jest to mock a default export (the Prisma Client instance in ../db.ts), and uses the mockDeep method from jest-mock-extended to enable access to the objects and methods available on Prisma Client. It then resets the mocked instance before each test is run.


// setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", '<rootDir>/src/lib/__mocks__/db.ts'],
