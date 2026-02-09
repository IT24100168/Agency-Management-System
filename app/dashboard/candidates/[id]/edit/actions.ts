
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { candidateFormSchema } from '../../register/schema'
import { revalidatePath } from 'next/cache'

export async function updateCandidate(id: string, formData: FormData) {
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
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Candidate.',
        }
    }

    const { error } = await supabase
        .from('candidates')
        .update({
            ...validatedFields.data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

    if (error) {
        console.error("Supabase Update Error:", error)
        return {
            message: 'Database Error: Failed to Update Candidate.',
            error: error.message
        }
    }

    revalidatePath('/dashboard/candidates')
    revalidatePath(`/dashboard/candidates/${id}`)
    redirect(`/dashboard/candidates/${id}`)
}
