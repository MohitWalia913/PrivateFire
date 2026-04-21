'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, Mail, Shield } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    setError('')

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message || 'Unable to send reset email.')
      } else {
        setStatus('Password reset email sent. Please check your inbox.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-800 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-8 fire-pulse">
            <Flame size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Reset Your Password Securely</h2>
          <p className="text-orange-100 mb-8 leading-relaxed">Enter your account email and we&apos;ll send a secure recovery link.</p>
        </div>
        <p className="relative text-orange-200 text-xs">© 2026 Private Fire. All rights reserved.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5">
              <Shield size={22} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-500 text-sm">We&apos;ll email you a reset link.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-5">{error}</div>}
          {status && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm mb-5">{status}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full btn-glow transition-all text-sm mt-2">
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Back to{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
