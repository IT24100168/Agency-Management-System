
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
    const supabase = await createClient()

    const candidate_id = formData.get('candidate_id') as string
    const type = formData.get('type') as string
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('accounting')
        .insert([
            {
                candidate_id,
                type,
                amount,
                description,
            },
        ])

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/candidates/${candidate_id}`)
}

export async function getTransactions(candidate_id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('accounting')
        .select('*')
        .eq('candidate_id', candidate_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    return data
}
