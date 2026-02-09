
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats() {
    const supabase = await createClient()

    // 1. Total Candidates
    const { count: totalCandidates } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })

    // 2. Active Visas (Status = 'Visa')
    const { count: activeVisas } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Visa')

    // 3. Monthly Income
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { data: incomeData } = await supabase
        .from('accounting')
        .select('amount')
        .eq('type', 'income')
        .gte('created_at', firstDay)

    const monthlyIncome = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0

    // 4. Pending Departures (Status = 'Ticket' or 'Embassy')
    const { count: pendingDepartures } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Ticket', 'Embassy'])

    return {
        totalCandidates: totalCandidates || 0,
        activeVisas: activeVisas || 0,
        monthlyIncome: monthlyIncome,
        pendingDepartures: pendingDepartures || 0
    }
}

export async function getRecentActivity() {
    const supabase = await createClient()
    // Fetch last 5 candidates
    const { data } = await supabase
        .from('candidates')
        .select('id, full_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}
