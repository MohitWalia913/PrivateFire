'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const initializeRecoverySession = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
        const hashParams = new URLSearchParams(hash)
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (accessToken && refreshToken && type === 'recovery') {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setError(sessionError.message || 'Invalid or expired reset link.')
            return
          }

          window.history.replaceState({}, '', '/reset-password')
          setSessionReady(true)
          return
        }

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !data.session) {
          setError('Reset link is invalid or expired. Please request a new one.')
          return
        }

        setSessionReady(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to validate reset link.')
      }
    }

    void initializeRecoverySession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message || 'Unable to reset password.')
        return
      }

      setStatus('Password updated successfully. Redirecting to sign in...')
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.')
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
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Create a New Password</h2>
          <p className="text-orange-100 mb-8 leading-relaxed">Use a strong password to keep your Private Fire account secure.</p>
        </div>
        <p className="relative text-orange-200 text-xs">© 2026 Private Fire. All rights reserved.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5">
              <Shield size={22} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm">Enter your new password below.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-5">{error}</div>}
          {status && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm mb-5">{status}</div>}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  disabled={!sessionReady || loading}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-10 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Confirm New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  disabled={!sessionReady || loading}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-10 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
                />
                <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!sessionReady || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full btn-glow transition-all text-sm mt-2"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
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
