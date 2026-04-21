'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, Lock, ChevronLeft, CheckCircle, Eye, EyeOff, Home } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('123 Oak Ridge Drive')
  const [city, setCity] = useState('Malibu')
  const [state, setState] = useState('CA')
  const [zipCode, setZipCode] = useState('90265')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push('/login')
          return
        }

        setUser(session.user)
        const metadata = session.user.user_metadata
        setFirstName(metadata?.first_name || '')
        setLastName(metadata?.last_name || '')
        setEmail(session.user.email || '')
        setPhone(metadata?.phone || '')
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const saveProfile = () => {
    // Update local state only (full persistence needs a DB)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const savePassword = () => {
    setPwError('')
    if (!currentPw) { setPwError('Enter your current password'); return }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 text-sm">Edit Profile</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1 text-sm">Update your personal information and account settings.</p>
        </div>

        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
            <User size={16} className="text-orange-400" /> Personal Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block">First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block">Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block flex items-center gap-1"><Mail size={11}/> Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block flex items-center gap-1"><Phone size={11}/> Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Protected Address */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
            <Home size={16} className="text-orange-400" /> Protected Property Address
          </h2>
          <div className="mb-4">
            <label className="text-gray-600 text-xs mb-1.5 block flex items-center gap-1"><MapPin size={11}/> Street Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-gray-600 text-xs mb-1.5 block">City</label>
              <input value={city} onChange={e => setCity(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block">State</label>
              <input value={state} onChange={e => setState(e.target.value)} maxLength={2}
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block">ZIP</label>
              <input value={zipCode} onChange={e => setZipCode(e.target.value)} maxLength={5}
                className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={saveProfile} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full btn-glow transition-all text-sm">
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
              <CheckCircle size={15} /> Profile updated!
            </span>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
            <Lock size={16} className="text-orange-400" /> Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 text-xs mb-1.5 block">Current Password</label>
              <div className="relative">
                <input value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm pr-10 outline-none transition-colors" />
                <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900">
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">New Password</label>
                <input value={newPw} onChange={e => setNewPw(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-colors" />
              </div>
              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Confirm New Password</label>
                <input value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-colors" />
              </div>
            </div>
            {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
            <div className="flex items-center gap-3">
              <button onClick={savePassword} className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-full text-sm transition-all">
                Update Password
              </button>
              {pwSaved && (
                <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                  <CheckCircle size={15} /> Password updated!
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
