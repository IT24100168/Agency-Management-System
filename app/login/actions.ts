
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Invalid%20credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Dev User', // Default metadata for the trigger to work
            }
        }
    })

    if (error) {
        console.error('Signup Error:', error)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (!data.session) {
        console.log('Signup successful but no session. Email confirmation might be required.')
        redirect('/login?message=Check email for confirmation')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
