
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Candidate } from '@/types/candidate'

export async function getCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Map Prisma result to Candidate type (frontend expects snake_case for now)
        return await Promise.all(candidates.map(async c => ({
            id: c.id,
            registration_number: c.registrationNumber || undefined,
            passport_no: c.passportNo,
            full_name: c.fullName,
            photo: c.photo || undefined,
            agent_id: c.agentId || undefined, // Handle nullable
            status: c.status as any, // Cast to string union type
            dob: c.dob ? c.dob.toISOString() : undefined,
            gender: c.gender || "",
            contact_number: c.contactNumber || undefined,
            address: c.address || undefined,
            created_at: c.createdAt.toISOString(),
            has_initial_payment: await prisma.accounting.findFirst({
                where: {
                    candidateId: c.id,
                    type: 'income',
                    amount: { gt: 0 }
                }
            }).then(t => !!t)
        })));
    } catch (error) {
        console.error('Error fetching candidates:', error)
        return []
    }
}

export async function assignAgent(candidateId: string, agentId: string) {
    try {
        await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                agentId: agentId === 'unassigned' || agentId === '' ? null : agentId
            }
        })

        revalidatePath(`/dashboard/candidates/${candidateId}`)
        return { success: true }
    } catch (error) {
        console.error("Error assigning agent:", error)
        return { success: false, error: String(error) }
    }
}
