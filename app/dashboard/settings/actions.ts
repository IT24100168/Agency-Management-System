
'use server'


import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const passwordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6)
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

const userSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'staff', 'agent'])
})

export async function updatePassword(prevState: any, formData: FormData) {
    const session = await verifySession()
    if (!session?.isAuth || !session.userId) return { error: "Not authenticated", success: "" }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    const validated = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword })

    if (!validated.success) {
        return { error: validated.error.issues[0].message, success: "" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        })

        if (!user) return { error: "User not found", success: "" }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordsMatch) return { error: "Incorrect current password", success: "" }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: session.userId },
            data: { password: hashedPassword }
        })

        return { success: "Password updated successfully", error: "" }
    } catch (error) {
        console.error("Password update error:", error)
        return { error: "Failed to update password", success: "" }
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const session = await verifySession()
    if (session?.role !== 'admin') return { error: "Unauthorized", success: "" }

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as 'admin' | 'staff' | 'agent'

    const validated = userSchema.safeParse({ fullName, email, password, role })

    if (!validated.success) {
        return { error: validated.error.issues[0].message, success: "" }
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return { error: "User already exists", success: "" }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role
            }
        })

        revalidatePath('/dashboard/settings')
        return { success: "User created successfully", error: "" }
    } catch (error) {
        console.error("User creation error:", error)
        return { error: "Failed to create user", success: "" }
    }
}

export async function getUsers() {
    const session = await auth()
    const user = session?.user as any
    if (user?.role !== 'admin') return []

    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
        }
    })
}
