
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAccountingStats() {
    const totalIncome = await prisma.accounting.aggregate({
        where: { type: 'income' },
        _sum: { amount: true }
    })

    const totalExpense = await prisma.accounting.aggregate({
        where: { type: 'expense' },
        _sum: { amount: true }
    })

    const income = Number(totalIncome._sum.amount || 0)
    const expense = Number(totalExpense._sum.amount || 0)

    return {
        income,
        expense,
        balance: income - expense
    }
}

export async function getRecentTransactions() {
    try {
        const transactions = await prisma.accounting.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                candidate: {
                    select: { fullName: true }
                }
            }
        })

        return transactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: Number(t.amount),
            description: t.description,
            date: t.createdAt.toISOString(),
            candidateName: t.candidate?.fullName
        }))
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return []
    }
}

export async function addTransaction(formData: FormData) {
    const type = formData.get('type') as string
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const candidateId = formData.get('candidateId') as string | null

    if (!type || isNaN(amount)) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.accounting.create({
            data: {
                type,
                amount,
                description,
                candidateId: candidateId || null
            }
        })
        revalidatePath('/dashboard/accounting')
        return { success: true }
    } catch (error) {
        console.error("Failed to add transaction:", error)
        return { error: "Database error" }
    }
}

export async function getCompactCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            select: { id: true, fullName: true, passportNo: true },
            orderBy: { createdAt: 'desc' }
        })
        return candidates
    } catch {
        return []
    }
}
