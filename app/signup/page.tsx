'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Flame, Eye, EyeOff, User, Mail, Lock, Phone, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    // Register via API
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }
    // Auto sign in after register
    await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/dashboard' })
  }

  const perks = [
    'Free access to live California fire map',
    'Fire risk prediction layer',
    'Emergency alerts near your address',
    'Access to the coverage application system',
  ]

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-800 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-8 fire-pulse">
            <Flame size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Join California&apos;s Premier Fire Protection Network</h2>
          <p className="text-orange-100 mb-8 leading-relaxed">Free to sign up. Access the live fire map and real-time fire alerts. Upgrade to apply for private fire coverage.</p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-white flex-shrink-0" />
                <span className="text-orange-100 text-sm">{p}</span>
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-500 text-sm">Free forever. No credit card required.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">First Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input required value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} placeholder="John" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Last Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input required value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} placeholder="Smith" className={inputClass} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="john@example.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 (555) 000-0000" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min. 8 characters"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-10 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="password" value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} placeholder="Repeat password" className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full btn-glow transition-all text-sm mt-2">
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-gray-400 text-xs">or sign up with</span></div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-200 py-3 rounded-xl text-sm transition-all w-full shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => signIn('credentials', { email: 'demo@privatefireapp.com', password: 'demo1234', callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 py-3 rounded-xl text-sm transition-all w-full font-medium"
            >
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.3.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Sign up with Apple
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">Sign In</Link>
          </p>
          <p className="text-center text-gray-400 text-xs mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
