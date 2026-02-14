
'use server'

import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { saltAndHashPassword } from '@/lib/password'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        await signIn('credentials', {
            email,
            password,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    redirect('/login?error=Invalid credentials')
                default:
                    redirect('/login?error=Something went wrong')
            }
        }
        throw error
    }
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
