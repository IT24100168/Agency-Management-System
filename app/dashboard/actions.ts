
'use server'

import { prisma } from '@/lib/prisma'
import { cachedFetch, invalidateCache } from '@/lib/cache'

export async function getDashboardStats() {
    return cachedFetch('dashboard:stats', async () => {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

        // Run ALL independent queries in parallel instead of sequentially
        const [
            totalCandidates,
            incomeAgg,
            expenseAgg,
            totalAgents,
            candidatesThisMonth,
            candidatesInProcessing,
            countryStats,
            incomeHistory
        ] = await Promise.all([
            prisma.candidate.count(),
            prisma.accounting.aggregate({
                _sum: { amount: true },
                where: { type: 'income', createdAt: { gte: firstDay } }
            }),
            prisma.accounting.aggregate({
                _sum: { amount: true },
                where: { type: 'expense', createdAt: { gte: firstDay } }
            }),
            prisma.agent.count(),
            prisma.candidate.count({ where: { createdAt: { gte: firstDay } } }),
            prisma.candidate.count({ where: { status: 'Processing' } }),
            getCountryStats(),
            getIncomeHistory()
        ])

        const monthlyIncome = incomeAgg._sum.amount ? incomeAgg._sum.amount.toNumber() : 0
        const monthlyExpenses = expenseAgg._sum.amount ? expenseAgg._sum.amount.toNumber() : 0

        return {
            totalCandidates,
            monthlyIncome,
            monthlyExpenses,
            totalAgents,
            countryStats,
            incomeHistory,
            candidatesThisMonth,
            candidatesInProcessing
        }
    }, 30) // Cache for 30 seconds
}

async function getIncomeHistory() {
    // Build month boundaries
    const months = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        d.setDate(1)
        d.setHours(0, 0, 0, 0)
        months.push(d)
    }

    const sixMonthsAgo = months[0]

    // SINGLE query instead of 6 separate aggregate queries
    const allIncome = await prisma.accounting.findMany({
        where: {
            type: 'income',
            createdAt: { gte: sixMonthsAgo }
        },
        select: { amount: true, createdAt: true }
    })

    // Group by month in-memory
    return months.map(date => {
        const nextMonth = new Date(date)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        const monthTotal = allIncome
            .filter(t => t.createdAt >= date && t.createdAt < nextMonth)
            .reduce((sum, t) => sum + (t.amount ? Number(t.amount) : 0), 0)

        return {
            name: date.toLocaleString('default', { month: 'short' }),
            total: monthTotal
        }
    })
}

async function getCountryStats() {
    // Specific countries requested
    const targetCountries = ['Romania', 'Qatar', 'Kuwait', 'Dubai', 'Oman', 'Jordan', 'Saudi Arabia']

    // Group by jobCountry
    const group = await prisma.candidate.groupBy({
        by: ['jobCountry'],
        _count: {
            id: true
        }
    })

    // Map to simple object { CountryName: count }
    const stats: Record<string, number> = {}

    // Initialize defaults to 0
    targetCountries.forEach(c => stats[c] = 0)
    stats['Other / Not Specified'] = 0

    group.forEach(g => {
        if (g.jobCountry && g.jobCountry.trim() !== "") {
            const dbCountryStr = g.jobCountry.trim().toLowerCase()
            const match = targetCountries.find(tc => tc.toLowerCase() === dbCountryStr)
            
            if (match) {
                stats[match] += g._count.id
            } else {
                stats['Other / Not Specified'] += g._count.id
            }
        } else {
            stats['Other / Not Specified'] += g._count.id
        }
    })

    return stats
}

export async function getRecentActivity() {
    // Fetch last 5 candidates
    const candidates = await prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            fullName: true,
            status: true,
            createdAt: true
        }
    })

    // Map to snake_case to match UI expectations (consistent with rest of app types)
    return candidates.map(c => ({
        id: c.id,
        full_name: c.fullName,
        status: c.status,
        created_at: c.createdAt.toISOString()
    }))
}
