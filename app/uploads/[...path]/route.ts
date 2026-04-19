import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    try {
        const params = await props.params;
        const filePath = join(process.cwd(), 'public', 'uploads', ...params.path)
        
        const fileBuffer = await readFile(filePath)
        
        const ext = params.path[params.path.length - 1].split('.').pop()?.toLowerCase()
        let contentType = 'application/octet-stream'
        
        if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
        else if (ext === 'png') contentType = 'image/png'
        else if (ext === 'pdf') contentType = 'application/pdf'
        else if (ext === 'webp') contentType = 'image/webp'
        else if (ext === 'gif') contentType = 'image/gif'
        
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        })
    } catch (error: any) {
        // Output the full error to the browser precisely so we can diagnose Hostinger's filesystem
        const debugInfo = `File not found.\n\nTried to open:\n${join(process.cwd(), 'public', 'uploads', ...(await props.params).path)}\n\nError details:\n${error.message}`
        return new NextResponse(debugInfo, { status: 404 })
    }
}
