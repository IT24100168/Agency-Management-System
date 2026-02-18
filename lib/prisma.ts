import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
    // This will appear in the browser if we are in dev/error page
    throw new Error("CRITICAL: DATABASE_URL is missing from process.env")
}

const connectionLimitedUrl = dbUrl.includes('?')
    ? `${dbUrl}&connection_limit=2`
    : `${dbUrl}?connection_limit=2`

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: connectionLimitedUrl,
        },
    },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
