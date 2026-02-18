
'use server'

import { prisma } from '@/lib/prisma'
import { saltAndHashPassword } from '@/lib/password'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

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

        await createSession(user.id, user.role)
    } catch (error) {
        // Redirect throws an error, so we need to rethrow it if it's a redirect
        if (isRedirectError(error)) throw error
        console.error('Login error FULL DETAILS:', error) // Keep this for server logs
        redirect('/login?error=System error. Please contact admin.')
    }

    redirect('/dashboard')
}

function isRedirectError(error: any) {
    return error && typeof error === 'object' && (error.digest?.startsWith('NEXT_REDIRECT') || error.message === 'NEXT_REDIRECT')
}

export async function signup(formData: FormData) {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const validatedFields = signupSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const errorMessage = validatedFields.error.flatten().fieldErrors.password?.[0] || "Invalid input"
        redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
    }

    const { email, password } = validatedFields.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        redirect('/login?error=User already exists')
    }

    const hashedPassword = await saltAndHashPassword(password)

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: 'Dev User',
                role: 'staff' // Default role
            }
        })
    } catch (error) {
        console.error('Signup Error:', error)
        redirect('/login?error=Database error')
    }

    redirect('/login?message=Account created! Please sign in.')
}
