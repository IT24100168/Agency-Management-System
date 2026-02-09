
'use server'

import { createClient } from '@/utils/supabase/server'
import { Agent } from '@/types/agent'

export async function getAgents() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching agents:', error)
        return []
    }

    return data as Agent[]
}
