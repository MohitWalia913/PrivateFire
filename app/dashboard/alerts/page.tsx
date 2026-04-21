'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronLeft, CheckCircle, MapPin, Mail, Phone, Zap, AlertTriangle, Flame } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function AlertSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [radius, setRadius] = useState(25)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [pushAlerts, setPushAlerts] = useState(true)
  const [threshold, setThreshold] = useState<'any' | 'major' | 'critical'>('any')
  const [saved, setSaved] = useState(false)

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
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-orange-500' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )

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
          <span className="text-gray-700 text-sm">Alert Settings</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Fire Alert Settings</h1>
          <p className="text-gray-600 mt-1 text-sm">Configure how and when you receive wildfire notifications.</p>
        </div>

        {/* Alert radius */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
            <MapPin size={16} className="text-orange-400" /> Alert Radius
          </h2>
          <p className="text-gray-500 text-xs mb-5">Get notified when fires are within this distance of your protected address.</p>
          <div className="grid grid-cols-4 gap-3">
            {[10, 25, 50, 100].map(r => (
              <button key={r} onClick={() => setRadius(r)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${radius === r ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {r} mi
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3 flex items-center gap-1.5">
            <MapPin size={11} /> Monitoring: 123 Oak Ridge Drive, Malibu, CA 90265
          </p>
        </div>

        {/* Alert threshold */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-400" /> Alert Threshold
          </h2>
          <p className="text-gray-500 text-xs mb-5">Choose which fire events trigger an alert.</p>
          <div className="space-y-3">
            {([
              ['any', 'Any Fire', 'Alert for all new incidents, regardless of size', 'text-blue-400'],
              ['major', 'Major Fires Only', 'Fires over 100 acres or &lt;75% contained', 'text-yellow-400'],
              ['critical', 'Critical Fires Only', 'Fires with &lt;25% containment or rapid spread', 'text-red-400'],
            ] as const).map(([val, label, desc, color]) => (
              <button key={val} onClick={() => setThreshold(val)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${threshold === val ? 'border-orange-500/50 bg-orange-500/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame size={14} className={color} />
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{label}</p>
                      <p className="text-gray-500 text-xs" dangerouslySetInnerHTML={{ __html: desc }} />
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${threshold === val ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notification channels */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
            <Bell size={16} className="text-orange-400" /> Notification Channels
          </h2>
          <p className="text-gray-500 text-xs mb-5">Choose how you receive alerts.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Email Alerts</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
              </div>
              <Toggle on={emailAlerts} onClick={() => setEmailAlerts(v => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Phone size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">SMS Alerts</p>
                  <p className="text-gray-500 text-xs">{user?.phone || 'Add phone number in profile'}</p>
                </div>
              </div>
              <Toggle on={smsAlerts} onClick={() => setSmsAlerts(v => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Zap size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Push Notifications</p>
                  <p className="text-gray-500 text-xs">Via Private Fire app</p>
                </div>
              </div>
              <Toggle on={pushAlerts} onClick={() => setPushAlerts(v => !v)} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full btn-glow transition-all text-sm">
            Save Alert Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
              <CheckCircle size={15} /> Settings saved!
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
