
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { PROCESSING_STEPS } from "@/lib/constants"
// STEPS_ORDER removed

export async function toggleProcessingStep(candidateId: string, type: string, isCompleted: boolean) {
    try {
        const existingStep = await prisma.processingStep.findFirst({
            where: {
                candidateId,
                type
            }
        })

        if (existingStep) {
            await prisma.processingStep.update({
                where: { id: existingStep.id },
                data: {
                    status: isCompleted ? 'Completed' : 'Pending',
                    completionDate: isCompleted ? new Date() : null
                }
            })
        } else {
            await prisma.processingStep.create({
                data: {
                    candidateId,
                    type,
                    status: isCompleted ? 'Completed' : 'Pending',
                    completionDate: isCompleted ? new Date() : null
                }
            })
        }

        // Update Candidate Main Status
        // Logic: Find the last completed step in the order
        const allSteps = await prisma.processingStep.findMany({
            where: { candidateId, status: 'Completed' }
        })

        let newStatus = 'Registered'

        // Check identifying the highest index
        let maxIndex = -1

        // Consider "Registered" as base (index 0)
        // Check DB steps
        for (const step of allSteps) {
            const index = PROCESSING_STEPS.indexOf(step.type as any)
            if (index > maxIndex) {
                maxIndex = index
                newStatus = step.type
            }
        }

        // Only update if the new status is "ahead" or valid? 
        // Or should we just strictly follow the highest completed step?
        // Let's stick to highest completed step.

        if (maxIndex === -1) {
            // No steps completed in DB, keep as 'Registered' (which is default)
            newStatus = 'Registered'
        }

        await prisma.candidate.update({
            where: { id: candidateId },
            data: { status: newStatus }
        })

        revalidatePath(`/dashboard/candidates/${candidateId}`)
        return { success: true }

    } catch (error) {
        console.error("Error toggling processing step:", error)
        return { success: false, error: String(error) }
    }
}
