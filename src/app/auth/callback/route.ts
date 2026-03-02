import { NextResponse } from 'next/server'
// The user requests a route handler using @supabase/ssr
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/directory'

    console.log('🔄 Auth Callback triggered', { url: request.url, hasCode: !!code })

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (error) {
                            console.error('❌ Cookie set error in callback:', error)
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('✅ Exchange successful, redirecting to', next)
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('❌ Exchange error:', error.message)
            return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
        }
    }

    // Checking for error in query params (e.g. access denied)
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (errorParam) {
        console.error('❌ Auth provider error:', { errorParam, errorDescription })
        return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(errorDescription || errorParam)}`)
    }

    console.warn('⚠️ No code or error found in auth callback')
    return NextResponse.redirect(`${origin}/?error=no-code-found`)
}
