import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    let dbCheck = {
        connected: false,
        error: null as any
    }

    try {
        await prisma.$queryRaw`SELECT 1`
        dbCheck.connected = true
    } catch (err: any) {
        dbCheck.error = err.message
    }

    return NextResponse.json({
        status: 'Diagnostic Run',
        timestamp: new Date().toISOString(),
        db: dbCheck,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_SET: !!process.env.DATABASE_URL,
        }
    })
}
