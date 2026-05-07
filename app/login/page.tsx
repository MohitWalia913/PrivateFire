'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Eye, EyeOff, Flame, Lock, Mail, Map, Phone, Shield } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { signInWithGoogle } from '@/lib/supabase/oauth'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionPending, setSessionPending] = useState(true)

  useEffect(() => {
    const errorParam = new URLSearchParams(window.location.search).get('error')
    if (errorParam) {
      setError(errorParam)
    }
  }, [])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let cancelled = false

    void (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return
        if (session?.user) {
          router.replace('/dashboard')
          return
        }
      } catch {
        // Let the user see the login form if session cannot be read.
      }
      if (!cancelled) setSessionPending(false)
    })()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        router.replace('/dashboard')
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    const handleLegacyHashAuth = async () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
      if (!hash) return

      const hashParams = new URLSearchParams(hash)
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      // Support legacy Supabase confirmation links that return tokens in URL hash.
      if (!accessToken || !refreshToken || (type !== 'signup' && type !== 'magiclink' && type !== 'recovery')) {
        return
      }

      try {
        const supabase = getSupabaseBrowserClient()
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          setError(sessionError.message || 'Unable to complete sign in from verification link.')
          return
        }

        const destination = type === 'recovery' ? '/reset-password' : '/dashboard'
        window.history.replaceState({}, '', destination)
        router.push(destination)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to complete sign in from verification link.')
      }
    }

    void handleLegacyHashAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (signInError) {
        setError(signInError.message || 'Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in right now.')
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    setOauthLoading(true)
    try {
      const { error: oauthErr } = await signInWithGoogle({ next: '/dashboard' })
      if (oauthErr) {
        setError(oauthErr.message || 'Google sign-in failed.')
        setOauthLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.')
      setOauthLoading(false)
    }
  }

  if (sessionPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" aria-hidden />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-800 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-8 fire-pulse">
            <Flame size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Welcome Back to Your Fire Protection Dashboard</h2>
          <p className="text-orange-100 mb-8 leading-relaxed">Monitor active fires, manage your protection bids, and stay connected with your dedicated fire response team.</p>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                { Icon: Map, label: 'Live Fire Map' },
                { Icon: Bell, label: 'Risk Alerts' },
                { Icon: Shield, label: 'Protection Status' },
                { Icon: Phone, label: 'Team Contact' },
              ] as const
            ).map(({ Icon, label }) => (
              <div key={label} className="bg-white/15 border border-white/20 rounded-xl p-4">
                <div className="mb-2 text-white">
                  <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                </div>
                <p className="text-white text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-orange-200 text-xs">© 2026 Private Fire. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5">
              <Shield size={22} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500 text-sm">Access your Private Fire dashboard.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="john@example.com"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-gray-600 font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Your password"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-10 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full btn-glow transition-all text-sm mt-2">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-gray-400 text-xs">or continue with</span></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Google button — official style */}
            <button
              type="button"
              disabled={oauthLoading}
              onClick={() => void handleGoogle()}
              className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-medium border border-gray-200 py-3 rounded-xl text-sm transition-all w-full shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {oauthLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-medium">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
