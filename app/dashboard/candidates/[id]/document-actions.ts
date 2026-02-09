
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadDocument(formData: FormData) {
    const supabase = await createClient()

    const candidate_id = formData.get('candidate_id') as string
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) return { error: 'No file uploaded' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${candidate_id}/${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

    if (uploadError) {
        return { error: uploadError.message }
    }

    // 2. Insert into DB
    const { error: dbError } = await supabase
        .from('documents')
        .insert({
            candidate_id,
            name: file.name,
            type,
            file_path: filePath
        })

    if (dbError) {
        return { error: dbError.message }
    }

    revalidatePath(`/dashboard/candidates/${candidate_id}`)
    return { success: true }
}

export async function getDocuments(candidate_id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('candidate_id', candidate_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    // Generate signed URLs for viewing
    const documentsWithUrls = await Promise.all(data.map(async (doc) => {
        const { data: signedUrl } = await supabase.storage
            .from('documents')
            .createSignedUrl(doc.file_path, 3600) // 1 hour access

        return {
            ...doc,
            url: signedUrl?.signedUrl
        }
    }))

    return documentsWithUrls
}
