
'use server'

import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export async function getCandidate(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) {
        console.error('Error fetching candidate:', error)
        return null
    }

    return data
}
