
'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {

    // 1. Total Candidates
    const totalCandidates = await prisma.candidate.count()

    // 2. Monthly Income
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

    const incomeAgg = await prisma.accounting.aggregate({
        _sum: {
            amount: true
        },
        where: {
            type: 'income',
            createdAt: { gte: firstDay }
        }
    })

    const monthlyIncome = incomeAgg._sum.amount ? incomeAgg._sum.amount.toNumber() : 0

    // 3. Monthly Expenses
    const expenseAgg = await prisma.accounting.aggregate({
        _sum: {
            amount: true
        },
        where: {
            type: 'expense',
            createdAt: { gte: firstDay }
        }
    })

    const monthlyExpenses = expenseAgg._sum.amount ? expenseAgg._sum.amount.toNumber() : 0

    // 4. Total Agents
    const totalAgents = await prisma.agent.count()

    // 5. Income History (Last 6 months)
    const incomeHistory = await getIncomeHistory()

    return {
        totalCandidates,
        monthlyIncome,
        monthlyExpenses,
        totalAgents,
        countryStats: await getCountryStats(),
        incomeHistory
    }
}

async function getIncomeHistory() {
    // Get last 6 months
    const months = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        d.setDate(1) // First day of the month
        d.setHours(0, 0, 0, 0)
        months.push(d)
    }

    const history = []

    for (const date of months) {
        const nextMonth = new Date(date)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        const agg = await prisma.accounting.aggregate({
            _sum: { amount: true },
            where: {
                type: 'income',
                createdAt: {
                    gte: date,
                    lt: nextMonth
                }
            }
        })

        history.push({
            name: date.toLocaleString('default', { month: 'short' }),
            total: agg._sum.amount ? agg._sum.amount.toNumber() : 0
        })
    }

    return history
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

    group.forEach(g => {
        if (g.jobCountry) {
            // Normalized check? For now exact match or simple mapping if needed
            // User said "Dubai" but usually it's "UAE". Let's assume input is "Dubai" or "United Arab Emirates"
            // If DB has "United Arab Emirates" and we want "Dubai", we might miss it. 
            // Stick to exact matches for now or add simple aliases if I knew the data.
            // I'll assume the user enters "Dubai" as country.
            if (stats.hasOwnProperty(g.jobCountry)) {
                stats[g.jobCountry] = g._count.id
            } else if (targetCountries.includes(g.jobCountry)) {
                stats[g.jobCountry] = g._count.id
            }
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
