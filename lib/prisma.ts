import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const databaseUrl = process.env.DATABASE_URL
const connectionLimitedUrl = databaseUrl?.includes('?')
    ? `${databaseUrl}&connection_limit=2`
    : `${databaseUrl}?connection_limit=2`

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: connectionLimitedUrl,
        },
    },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
