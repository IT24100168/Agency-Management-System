
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { agentFormSchema } from '../../register/schema'
import { redirect } from "next/navigation"

export async function updateAgent(id: string, formData: FormData) {
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
            message: 'Missing Fields. Failed to Update Agent.',
        }
    }

    const { name, type, email, phone, address } = validatedFields.data

    try {
        await prisma.agent.update({
            where: { id },
            data: {
                name,
                type,
                contactInfo: {
                    email,
                    phone,
                    address
                }
            }
        })
    } catch (error) {
        console.error("Prisma Update Error:", error)
        return {
            message: 'Database Error: Failed to Update Agent.',
            error: String(error)
        }
    }

    revalidatePath('/dashboard/agents')
    return { success: true, redirect: '/dashboard/agents' }
}
