
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { candidateFormSchema } from './schema'

export async function createCandidate(formData: FormData) {
    const supabase = await createClient()

    // Extract data from FormData and sanitize nulls
    const rawData = {
        full_name: formData.get('full_name'),
        passport_no: formData.get('passport_no'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        contact_number: formData.get('contact_number'),
        address: formData.get('address') || undefined,
        agent_id: formData.get('agent_id') || undefined,
    }

    // Validate using Zod
    const validatedFields = candidateFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Candidate.',
        }
    }

    const { data, error } = await supabase
        .from('candidates')
        .insert([
            {
                ...validatedFields.data,
                status: 'Registered',
            },
        ])
        .select()

    if (error) {
        console.error("Supabase Insert Error:", error)
        return {
            message: 'Database Error: Failed to Create Candidate.',
            error: error.message
        }
    }

    redirect('/dashboard/candidates')
}
