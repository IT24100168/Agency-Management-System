
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getCandidates() {
    const supabase = await createClient()

    // For MVP, fetching all. In production, implement server-side pagination.
    const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching candidates:', error)
        return []
    }

    return data
}
