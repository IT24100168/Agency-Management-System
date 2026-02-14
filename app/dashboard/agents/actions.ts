
'use server'

import { prisma } from '@/lib/prisma'
import { Agent } from '@/types/agent'
import { revalidatePath } from 'next/cache'

export async function getAgents(): Promise<Agent[]> {
    try {
        const agents = await prisma.agent.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })

        return agents.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type as "sub-agent" | "foreign",
            contact_info: a.contactInfo ? JSON.parse(JSON.stringify(a.contactInfo)) : undefined,
            user_id: a.userId || undefined,
            created_at: a.createdAt.toISOString()
        }))
    } catch (error) {
        console.error('Error fetching agents:', error)
        return []
    }
}

export async function getAgent(id: string): Promise<Agent | null> {
    try {
        const agent = await prisma.agent.findUnique({
            where: { id }
        })

        if (!agent) return null

        return {
            id: agent.id,
            name: agent.name,
            type: agent.type as "sub-agent" | "foreign",
            contact_info: agent.contactInfo ? JSON.parse(JSON.stringify(agent.contactInfo)) : undefined,
            user_id: agent.userId || undefined,
            created_at: agent.createdAt.toISOString()
        }
    } catch (error) {
        console.error('Error fetching agent:', error)
        return null
    }
}



export async function deleteAgent(id: string) {
    try {
        await prisma.agent.delete({
            where: { id }
        })
        revalidatePath('/dashboard/agents')
        return { success: true }
    } catch (error) {
        console.error('Error deleting agent:', error)
        return { success: false, error: String(error) }
    }
}

export async function getAgentCandidates(agentId: string) {
    try {
        const candidates = await prisma.candidate.findMany({
            where: { agentId },
            select: {
                id: true,
                fullName: true,
                registrationNumber: true,
                passportStatus: true,
                status: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return candidates.map(c => ({
            id: c.id,
            full_name: c.fullName,
            registration_number: c.registrationNumber,
            passport_status: c.passportStatus,
            status: c.status,
            created_at: c.createdAt.toISOString()
        }))
    } catch (error) {
        console.error('Error fetching agent candidates:', error)
        return []
    }
}
