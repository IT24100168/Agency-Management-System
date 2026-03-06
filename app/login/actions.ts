
'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const roleHint = formData.get('role_hint') as string

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !user.password) {
            redirect('/login?error=Invalid credentials')
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
            redirect('/login?error=Invalid credentials')
        }

        if (roleHint && user.role !== roleHint) {
            redirect(`/login?error=Access Denied: You cannot login from the ${roleHint === 'admin' ? 'Admin' : 'Staff'} portal.`)
        }

        await createSession(user.id, user.role)
    } catch (error) {
        // Redirect throws an error, so we need to rethrow it if it's a redirect
        if (isRedirectError(error)) throw error
        console.error('Login error:', error)
        redirect('/login?error=Something went wrong')
    }

    redirect('/dashboard')
}

function isRedirectError(error: any) {
    return error && typeof error === 'object' && (error.digest?.startsWith('NEXT_REDIRECT') || error.message === 'NEXT_REDIRECT')
}
