'use server'

import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reminderSchema = z.object({
    title: z.string().min(1, "Title is required"),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date")
})

export async function addReminder(prevState: any, formData: FormData) {
    const session = await verifySession()
    if (!session?.userId) return { error: "Not authenticated" }

    const title = formData.get('title') as string
    const dueDate = formData.get('dueDate') as string

    const validated = reminderSchema.safeParse({ title, dueDate })

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.reminder.create({
            data: {
                title,
                dueDate: new Date(dueDate),
                userId: session.userId
            }
        })
        revalidatePath('/dashboard')
        return { success: "Reminder set successfully" }
    } catch (error) {
        console.error("Failed to add reminder:", error)
        return { error: "Database error" }
    }
}

export async function getReminders() {
    const session = await verifySession()
    if (!session?.userId) return []

    try {
        const reminders = await prisma.reminder.findMany({
            where: { userId: session.userId },
            orderBy: { dueDate: 'asc' }
        })
        return reminders
    } catch (error) {
        console.error("Failed to get reminders:", error)
        return []
    }
}

export async function deleteReminder(id: string) {
    const session = await verifySession()
    if (!session?.userId) return { error: "Not authenticated" }

    try {
        // Ensure user owns the reminder
        const reminder = await prisma.reminder.findUnique({
            where: { id }
        })

        if (!reminder || reminder.userId !== session.user.id) {
            return { error: "Unauthorized" }
        }

        await prisma.reminder.delete({
            where: { id }
        })
        revalidatePath('/dashboard')
        return { success: "Reminder deleted" }
    } catch (error) {
        console.error("Failed to delete reminder:", error)
        return { error: "Database error" }
    }
}
