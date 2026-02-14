
'use server'

import { prisma } from '@/lib/prisma'

export async function getProcessingCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            select: {
                id: true,
                fullName: true,
                passportNo: true,
                status: true,
                photo: true,
                agent: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return candidates.map(c => ({
            id: c.id,
            name: c.fullName,
            passport: c.passportNo,
            status: c.status,
            photo: c.photo,
            agent: c.agent?.name
        }))
    } catch (error) {
        console.error('Error fetching processing candidates:', error)
        return []
    }
}
