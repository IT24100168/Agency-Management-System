
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    const envCheck = {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    let dbCheck = {
        connected: false,
        usersTableExists: false,
        error: null as any
    }

    try {
        // Check connection by selecting from a public table or checking auth
        const { error: authError } = await supabase.auth.getSession()
        if (!authError) dbCheck.connected = true

        // Check if users table exists by selecting 1 row (will fail with 404 or RLS error if table exists, 400 if not)
        // Actually simpler to check basic connectivity.
        // Let's try to select count.
        const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true })

        if (error) {
            // If error code is 42P01 (undefined_table), then schema wasn't run.
            dbCheck.error = error
            if (error.code === '42P01') {
                dbCheck.usersTableExists = false
            } else {
                dbCheck.usersTableExists = true // Likely RLS error, meaning table exists
            }
        } else {
            dbCheck.usersTableExists = true
        }
    } catch (err) {
        dbCheck.error = err
    }

    return NextResponse.json({
        status: 'Diagnostic Run',
        env: envCheck,
        db: dbCheck
    })
}
