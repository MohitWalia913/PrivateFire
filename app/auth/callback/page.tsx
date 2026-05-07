'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { oauthSafeNext } from '@/lib/supabase/oauth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [state, setState] = useState<{ kind: 'loading' | 'error'; message?: string }>({
    kind: 'loading',
  })

  useEffect(() => {
    let cancelled = false

    async function finish() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const oauthError =
        url.searchParams.get('error_description') || url.searchParams.get('error')

      const nextPath = oauthSafeNext(url.searchParams.get('next'))

      if (oauthError) {
        const msg =
          oauthError.replace(/\+/g, ' ').slice(0, 400) ||
          'Something went wrong during sign-in.'
        if (!cancelled) setState({ kind: 'error', message: msg })
        return
      }

      const hash = url.hash.startsWith('#') ? url.hash.slice(1) : ''
      const hashParams = hash ? new URLSearchParams(hash) : null

      /** Support implicit-token redirects (tokens in `#...`; `useSearchParams` never sees hash). */
      const accessToken = hashParams?.get('access_token') ?? undefined
      const refreshToken = hashParams?.get('refresh_token') ?? undefined

      const supabase = getSupabaseBrowserClient()

      try {
        const shortWait = (): Promise<void> =>
          new Promise(resolve => setTimeout(resolve, 50))

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          window.history.replaceState({}, '', nextPath)
          if (!cancelled) router.replace(nextPath)
          return
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          window.history.replaceState({}, '', nextPath)
          if (!cancelled) router.replace(nextPath)
          return
        }

        /*
         * Supabase client's default `detectSessionInUrl` may read query/hash async on init.
         * Wait briefly after init, then use an existing session.
         */
        await shortWait()
        let { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          await shortWait()
          ;({ data: { session } } = await supabase.auth.getSession())
        }
        if (session) {
          window.history.replaceState({}, '', nextPath)
          if (!cancelled) router.replace(nextPath)
          return
        }

        const msg =
          'No OAuth response was returned. Add this URL under Supabase → Authentication → URL Configuration → Redirect URLs: ' +
          `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
        if (!cancelled)
          setState({
            kind: 'error',
            message: msg,
          })
      } catch (e) {
        if (!cancelled)
          setState({
            kind: 'error',
            message:
              e instanceof Error ? e.message : 'Could not complete sign-in.',
          })
      }
    }

    void finish()
    return () => {
      cancelled = true
    }
  }, [router])

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <div
          className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <p className="text-sm text-gray-600">Completing sign-in…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-md w-full border border-red-200 bg-red-50 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium mb-3">Sign-in could not be completed</p>
        <p className="text-red-700 text-sm mb-5 text-left whitespace-pre-wrap break-words">{state.message}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
