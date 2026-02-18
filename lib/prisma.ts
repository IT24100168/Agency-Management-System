
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Force connection limit for Hostinger
const dbUrl = process.env.DATABASE_URL || ''
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
