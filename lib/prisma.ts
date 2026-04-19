
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })

// CRITICAL: Cache in ALL environments, not just development.
// Without this, production creates a new PrismaClient on every request,
// exhausting Hostinger's max_connections_per_hour limit.
globalForPrisma.prisma = prisma
