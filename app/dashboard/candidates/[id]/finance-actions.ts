
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
    const candidate_id = formData.get('candidate_id') as string
    const type = formData.get('type') as string
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const dateStr = formData.get('date') as string

    try {
        let documentUrl = undefined

        const documentFile = formData.get('document_file') as File | null
        if (documentFile && documentFile.size > 0 && documentFile.name !== 'undefined') {
            try {
                const { writeFile, mkdir } = await import('fs/promises')
                const { join } = await import('path')

                const bytes = await documentFile.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Create a unique file name
                const ext = documentFile.name.split('.').pop() || 'tmp'
                const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
                const uploadDir = join(process.cwd(), 'public', 'uploads', 'accounting')
                
                await mkdir(uploadDir, { recursive: true })
                await writeFile(join(uploadDir, fileName), buffer)
                
                documentUrl = `/uploads/accounting/${fileName}`
            } catch (error) {
                console.error("Document upload failed:", error)
            }
        }

        const dataPayload: any = {
            candidateId: candidate_id,
            type,
            amount,
            description,
        }

        if (documentUrl) {
            dataPayload.documentUrl = documentUrl
        }

        if (dateStr) {
            dataPayload.createdAt = new Date(dateStr)
        }

        await prisma.accounting.create({
            data: dataPayload
        })
    } catch (error) {
        console.error('Error adding transaction:', error)
        return { error: 'Failed to add transaction' }
    }

    revalidatePath(`/dashboard/candidates/${candidate_id}`)
}

export async function getTransactions(candidate_id: string) {
    try {
        const transactions = await prisma.accounting.findMany({
            where: {
                candidateId: candidate_id
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        // Map to snake_case if frontend expects it, or keep consistent with DB schema
        // The component likely expects snake_case based on previous Supabase usage.
        return transactions.map(t => ({
            id: t.id,
            candidate_id: t.candidateId,
            type: t.type,
            amount: Number(t.amount), // Decimal to Number
            description: t.description,
            document_url: t.documentUrl,
            created_at: t.createdAt.toISOString()
        }))

    } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
}
