'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Flame, Lock, Mail, Shield } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') return ''
    const err = new URLSearchParams(window.location.search).get('error')
    return err ? decodeURIComponent(err.replace(/\+/g, ' ')) : ''
  })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/admin/session')
        if (!cancelled && res.ok) {
          router.replace('/administrator/overview')
          return
        }
      } catch {
        // show login form
      }
      if (!cancelled) setChecking(false)
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      })

      if (signInError) {
        setError(signInError.message || 'Invalid email or password.')
        setLoading(false)
        return
      }

      const sessionRes = await fetch('/api/admin/session')
      if (!sessionRes.ok) {
        await supabase.auth.signOut()
        setError('This account does not have admin access.')
        setLoading(false)
        return
      }

      router.replace('/administrator/overview')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in right now.')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-orange-600 to-orange-800 p-12">
        <div>
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
            <Flame className="h-9 w-9 text-white" />
          </div>
          <h2 className="mb-4 text-4xl font-black leading-tight text-white">Private Fire Admin</h2>
          <p className="max-w-md text-orange-100 leading-relaxed">
            Secure console for operations: applications, customers, map data sources, and
            coverage approvals.
          </p>
        </div>
        <p className="text-xs text-orange-200">© 2026 Private Fire. Admin access only.</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-200 bg-orange-50">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="mb-2 text-3xl font-black text-gray-900">Admin sign in</h1>
            <p className="text-sm text-gray-500">
              Use your master admin credentials. Member login is on the{' '}
              <Link href="/login" className="text-orange-600 hover:underline">
                public sign-in page
              </Link>
              .
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="lgm10@humboldt.edu"
                  className="w-full rounded-xl border border-gray-300 py-3.5 pl-9 pr-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 py-3.5 pl-9 pr-10 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-orange-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in to Admin'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
