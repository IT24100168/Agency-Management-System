
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
    const candidate_id = formData.get('candidate_id') as string
    const type = formData.get('type') as string
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string

    try {
        await prisma.accounting.create({
            data: {
                candidateId: candidate_id,
                type,
                amount,
                description,
            }
        })
    } catch (error) {
        console.error('Error adding transaction:', error)
        return { error: 'Failed to add transaction' }
    }

    revalidatePath(`/dashboard/candidates/${candidate_id}`)
}

export async function getTransactions(candidate_id: string) {
    try {
        const transactions = await prisma.accounting.findMany({
            where: {
                candidateId: candidate_id
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        // Map to snake_case if frontend expects it, or keep consistent with DB schema
        // The component likely expects snake_case based on previous Supabase usage.
        return transactions.map(t => ({
            id: t.id,
            candidate_id: t.candidateId,
            type: t.type,
            amount: Number(t.amount), // Decimal to Number
            description: t.description,
            created_at: t.createdAt.toISOString()
        }))

    } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
}
