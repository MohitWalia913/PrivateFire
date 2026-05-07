'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { oauthSafeNext } from '@/lib/supabase/oauth'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<{ kind: 'loading' | 'error'; message?: string }>({
    kind: 'loading',
  })

  useEffect(() => {
    let cancelled = false

    async function finish() {
      const code = searchParams.get('code')
      const oauthError =
        searchParams.get('error_description') ||
        searchParams.get('error') ||
        null
      const next = oauthSafeNext(searchParams.get('next'))

      if (oauthError) {
        const msg =
          oauthError.replace(/\+/g, ' ').slice(0, 400) ||
          'Something went wrong during sign-in.'
        if (!cancelled) setState({ kind: 'error', message: msg })
        return
      }

      if (!code) {
        if (!cancelled) setState({ kind: 'error', message: 'Missing authorization code.' })
        return
      }

      try {
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          if (!cancelled)
            setState({
              kind: 'error',
              message: error.message || 'Could not complete sign-in.',
            })
          return
        }
        router.replace(next)
      } catch (e) {
        if (!cancelled)
          setState({
            kind: 'error',
            message: e instanceof Error ? e.message : 'Could not complete sign-in.',
          })
      }
    }

    void finish()
    return () => {
      cancelled = true
    }
  }, [router, searchParams])

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
        <p className="text-red-700 text-sm mb-5">{state.message}</p>
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

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div
            className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  )
}
