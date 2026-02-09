
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { agentFormSchema } from './schema'

export async function createAgent(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
    }

    const validatedFields = agentFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Agent.',
        }
    }

    const { data } = validatedFields
    const contact_info = {
        email: data.email || null,
        phone: data.phone,
        address: data.address || null
    }

    const { error } = await supabase
        .from('agents')
        .insert([
            {
                name: data.name,
                type: data.type,
                contact_info: contact_info
            },
        ])
        .select()

    if (error) {
        return {
            message: 'Database Error: Failed to Create Agent.',
            error: error.message
        }
    }

    redirect('/dashboard/agents')
}
