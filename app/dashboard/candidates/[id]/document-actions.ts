
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

export async function uploadDocument(formData: FormData) {
    const candidate_id = formData.get('candidate_id') as string
    const file = formData.get('file') as File
    const type = formData.get('type') as string // Document type (e.g. Passport)

    if (!file) return { error: 'No file uploaded' }

    // Validate file type and size (optional but recommended)
    // const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    // if (!allowedTypes.includes(file.type)) return { error: 'Invalid file type' }

    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    // Compression Logic
    const isImage = file.type.startsWith('image/')
    if (isImage) {
        try {
            const sharp = require('sharp');
            // Resize to max 1920px width/height and compress
            buffer = await sharp(buffer)
                .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80, mozjpeg: true }) // Convert to JPEG with compression
                .toBuffer();

            // If converted to JPEG, ensure extension matches or keep original if specific requirement.
            // For simplicity, we can keep original name but content is JPEG. 
            // Better practice: change extension to .jpg if we convert.
            // But to avoid complex logic with original filename extensions:
            // Let's just compress while maintaining format if possible, or force JPEG.
            // Let's stick to forcing JPEG for consistent compression.
        } catch (error) {
            console.error("Compression failed, saving original:", error)
        }
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    // Directory structure: public/uploads/candidates/[candidate_id]/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'candidates', candidate_id)

    try {
        await mkdir(uploadDir, { recursive: true })
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)

        // Save relative path for Public access
        const publicPath = `/uploads/candidates/${candidate_id}/${fileName}`

        await prisma.document.create({
            data: {
                candidateId: candidate_id,
                name: file.name,
                fileType: type,
                filePath: publicPath
            }
        })

    } catch (error) {
        console.error('Error uploading file:', error)
        return { error: 'Failed to upload file' }
    }

    revalidatePath(`/dashboard/candidates/${candidate_id}`)
    return { success: true }
}

export async function getDocuments(candidate_id: string) {
    try {
        const documents = await prisma.document.findMany({
            where: {
                candidateId: candidate_id
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.fileType,
            created_at: doc.createdAt.toISOString(),
            url: doc.filePath
        }))

    } catch (error) {
        console.error('Error fetching documents:', error)
        return []
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const doc = await prisma.document.findUnique({
            where: { id: documentId }
        })

        if (!doc) return { error: 'Document not found' }

        // Remove from filesystem
        const absolutePath = join(process.cwd(), 'public', doc.filePath)
        try {
            await unlink(absolutePath)
        } catch (e) {
            console.error("File delete error (might not exist):", e)
        }

        await prisma.document.delete({
            where: { id: documentId }
        })

        revalidatePath(`/dashboard/candidates/${doc.candidateId}`)
        return { success: true }
    } catch (error) {
        console.error('Error deleting document:', error)
        return { error: 'Failed to delete document' }
    }
}
