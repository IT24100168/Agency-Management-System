'use server'

import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cachedFetch } from '@/lib/cache'

export async function sendNotice(message: string) {
    const session = await verifySession()
    if (!session?.userId || session.role !== 'staff') {
        return { error: "Not authorized to send notice" }
    }

    if (!message || message.trim() === '') {
        return { error: "Message is required" }
    }

    try {
        await prisma.notice.create({
            data: {
                message: message.trim(),
                authorId: session.userId,
                // targetUserId is null, implying it targets "Admin"
            }
        })
        revalidatePath('/dashboard')
        return { success: "Notice sent to Admin successfully" }
    } catch (error) {
        console.error("Failed to send notice:", error)
        return { error: "Database error" }
    }
}

export async function sendNoticeToStaff(message: string, targetUserId: string) {
    const session = await verifySession()
    if (!session?.userId || session.role !== 'admin') {
        return { error: "Not authorized to send notice to staff" }
    }

    if (!message || message.trim() === '') {
        return { error: "Message is required" }
    }

    if (!targetUserId) {
        return { error: "Staff member must be selected" }
    }

    try {
        await prisma.notice.create({
            data: {
                message: message.trim(),
                authorId: session.userId,
                targetUserId: targetUserId
            }
        })
        revalidatePath('/dashboard')
        return { success: "Notice sent to Staff successfully" }
    } catch (error) {
        console.error("Failed to send notice to staff:", error)
        return { error: "Database error" }
    }
}

export async function getActiveNotices() {
    const session = await verifySession()
    if (!session?.userId) return []

    try {
        if (session.role === 'admin') {
            // Admins see:
            // 1. Unresolved notices sent by staff (targetUserId: null)
            const incomingUnresolved = await prisma.notice.findMany({
                where: { resolved: false, targetUserId: null },
                include: { author: { select: { fullName: true } } },
                orderBy: { createdAt: 'desc' }
            })
            // 2. Resolved notices they sent TO staff that they haven't acknowledged
            const sentResolved = await prisma.notice.findMany({
                where: { authorId: session.userId, resolved: true, staffAcknowledged: false },
                include: { targetUser: { select: { fullName: true } } },
                orderBy: { createdAt: 'desc' }
            })
            return [...incomingUnresolved, ...sentResolved].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        } else if (session.role === 'staff') {
            // Staff see:
            // 1. Unresolved notices sent TO them by admins (targetUserId: session.userId)
            const incomingUnresolved = await prisma.notice.findMany({
                where: { targetUserId: session.userId, resolved: false },
                include: { author: { select: { fullName: true } } },
                orderBy: { createdAt: 'desc' }
            })
            // 2. Resolved notices they sent TO admins (authorId: session.userId) that they haven't acknowledged
            const sentResolved = await prisma.notice.findMany({
                where: { authorId: session.userId, resolved: true, staffAcknowledged: false },
                include: { targetUser: { select: { fullName: true } } },
                orderBy: { createdAt: 'desc' }
            })
            return [...incomingUnresolved, ...sentResolved].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
        return []
    } catch (error) {
        console.error("Failed to fetch notices:", error)
        return []
    }
}

export async function resolveNotice(noticeId: string) {
    const session = await verifySession()
    if (!session?.userId) {
        return { error: "Not authorized" }
    }

    try {
        const notice = await prisma.notice.findUnique({ where: { id: noticeId } })
        if (!notice) return { error: "Notice not found" }

        // Security check
        if (notice.targetUserId === null && session.role !== 'admin') {
            return { error: "Only admins can resolve this broadcast notice" }
        }
        if (notice.targetUserId !== null && notice.targetUserId !== session.userId) {
            return { error: "Only the targeted user can resolve this notice" }
        }

        await prisma.notice.update({
            where: { id: noticeId },
            data: { resolved: true }
        })
        revalidatePath('/dashboard')
        return { success: "Notice marked as resolved" }
    } catch (error) {
        console.error("Failed to resolve notice:", error)
        return { error: "Database error" }
    }
}

export async function acknowledgeNotice(noticeId: string) {
    const session = await verifySession()
    if (!session?.userId) {
        return { error: "Not authorized" }
    }

    try {
        const notice = await prisma.notice.findUnique({ where: { id: noticeId } })
        if (!notice || notice.authorId !== session.userId) {
            return { error: "Only the author of the notice can acknowledge the resolution" }
        }

        await prisma.notice.update({
            where: { id: noticeId },
            data: { staffAcknowledged: true }
        })
        revalidatePath('/dashboard')
        return { success: "Notice acknowledged" }
    } catch (error) {
        console.error("Failed to acknowledge notice:", error)
        return { error: "Database error" }
    }
}

// Fetch staff members for Admin dropdown
export async function getStaffUsers() {
    const session = await verifySession()
    if (!session?.userId || session.role !== 'admin') return []

    return cachedFetch('staff:users', async () => {
        try {
            return await prisma.user.findMany({
                where: { role: 'staff' },
                select: { id: true, fullName: true, email: true }
            })
        } catch (error) {
            console.error("Failed to get staff users:", error)
            return []
        }
    }, 120) // Cache for 120 seconds — staff list rarely changes
}

// Fetch notice history for the current user
export async function getNoticeHistory() {
    const session = await verifySession()
    if (!session?.userId) return []

    try {
        if (session.role === 'admin') {
            return await prisma.notice.findMany({
                where: {
                    resolved: true,
                    OR: [
                        { targetUserId: null }, // Sent by staff to admin
                        { authorId: session.userId } // Sent by this admin to staff
                    ]
                },
                include: {
                    author: { select: { fullName: true } },
                    targetUser: { select: { fullName: true } }
                },
                orderBy: { createdAt: 'desc' }
            })
        } else if (session.role === 'staff') {
            return await prisma.notice.findMany({
                where: {
                    resolved: true,
                    OR: [
                        { targetUserId: session.userId }, // Sent to this staff
                        { authorId: session.userId } // Sent by this staff
                    ]
                },
                include: {
                    author: { select: { fullName: true } },
                    targetUser: { select: { fullName: true } }
                },
                orderBy: { createdAt: 'desc' }
            })
        }
        return []
    } catch (error) {
        console.error("Failed to fetch notice history:", error)
        return []
    }
}
