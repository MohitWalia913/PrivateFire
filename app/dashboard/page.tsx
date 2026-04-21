'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Flame, Shield, Phone, MapPin, Bell, AlertTriangle, CheckCircle, Clock, TrendingUp, LogOut, User, ChevronRight, Zap, Home, FileText, Plus } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAlertSettings, getCoverageApplication, getUserProfile } from '@/lib/supabase/user-data'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const FireMap = dynamic(() => import('@/components/FireMap'), { ssr: false, loading: () => (
  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
)})

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState(false)
  const [isApplicationApproved, setIsApplicationApproved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [alertRadius, setAlertRadius] = useState(25)
  const mockAlerts = [
    { name: 'Malibu Canyon Fire', distance: '8.4 mi', acres: 1240, time: 'Updated 12m ago', contained: 62, active: true },
    { name: 'Topanga Ridge Fire', distance: '16.2 mi', acres: 420, time: 'Updated 28m ago', contained: 88, active: true },
    { name: 'Ventura Brush Fire', distance: '31.7 mi', acres: 96, time: 'Updated 1h ago', contained: 100, active: false },
  ]
  const riskData = {
    level: 'High',
    score: 78,
    bg: 'bg-orange-50 border-orange-200',
    color: 'text-orange-600',
  }

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
        const [profile, settings, application] = await Promise.all([
          getUserProfile(supabase, session.user.id),
          getAlertSettings(supabase, session.user.id),
          getCoverageApplication(supabase, session.user.id),
        ])

        if (profile) {
          setProfileName(
            profile.first_name && profile.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : profile.first_name || session.user.email?.split('@')[0] || 'User',
          )
          setProfilePhone(profile.phone || '')
          if (profile.address_line1 && profile.city && profile.state && profile.zip_code) {
            setAddresses([{
              label: 'Primary Property',
              address: profile.address_line1,
              city: profile.city,
              state: profile.state,
              zip: profile.zip_code,
            }])
          } else {
            setAddresses([])
          }
        } else {
          setProfileName(session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User')
          setProfilePhone('')
          setCoverageStatus('not_covered')
          setAddresses([])
        }

        if (settings) {
          setAlertRadius(settings.alert_radius_miles)
        }

        if (application?.approved) {
          setHasSubmittedApplication(true)
          setIsApplicationApproved(true)
          setCoverageStatus('active')
        } else if (application?.submitted) {
          setHasSubmittedApplication(true)
          setIsApplicationApproved(false)
          setCoverageStatus('pending')
        } else if (profile) {
          setHasSubmittedApplication(false)
          setIsApplicationApproved(false)
          setCoverageStatus(profile.coverage_status)
        } else {
          setHasSubmittedApplication(false)
          setIsApplicationApproved(false)
          setCoverageStatus('not_covered')
        }
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state listener
    const supabase = getSupabaseBrowserClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        setUser(null)
        router.push('/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const [coverageStatus, setCoverageStatus] = useState<'not_covered' | 'pending' | 'active'>('not_covered')
  const coverageStatusConfig = {
    not_covered: { label: 'Not Covered', color: 'text-gray-500', bg: 'text-gray-400' },
    pending: { label: 'Pending Review', color: 'text-yellow-600', bg: 'text-yellow-500' },
    active: { label: 'Active', color: 'text-green-600', bg: 'text-green-500' },
  }

  const [addresses, setAddresses] = useState<{ label: string; address: string; city: string; state: string; zip: string }[]>([])

  const logout = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-500 text-sm">Welcome back</p>
            <h1 className="text-2xl font-black text-gray-900">
              {profileName || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'} <span className="text-orange-400">🔥</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/bids" className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full btn-glow transition-all">
              <FileText size={14} /> My Application
            </Link>
            <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-full transition-all">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className={`border rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${coverageStatus === 'active' ? 'bg-gradient-to-r from-green-50 to-green-100/50 border-green-200' : coverageStatus === 'pending' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-yellow-200' : 'bg-gradient-to-r from-gray-50 to-gray-100/50 border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${coverageStatus === 'active' ? 'bg-green-50 border-green-200' : coverageStatus === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <Shield size={22} className={coverageStatus === 'active' ? 'text-green-500' : coverageStatus === 'pending' ? 'text-yellow-500' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-0.5">Coverage Status</p>
              <p className={`text-lg font-black ${coverageStatusConfig[coverageStatus].color}`}>{coverageStatusConfig[coverageStatus].label}</p>
              {coverageStatus === 'not_covered' && <p className="text-gray-500 text-xs mt-0.5">Submit an application to request private fire protection.</p>}
              {coverageStatus === 'pending' && <p className="text-gray-500 text-xs mt-0.5">Your application is under review. We&apos;ll contact you soon.</p>}
              {coverageStatus === 'active' && <p className="text-gray-500 text-xs mt-0.5">Your property is actively protected by our team.</p>}
            </div>
          </div>
          <Link href="/dashboard/bids" className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-100 transition-all flex-shrink-0">
            {coverageStatus === 'not_covered' ? 'Start Application' : 'View Application'} <ChevronRight size={14} />
          </Link>
        </div>

        {/* Live Fire Map + Fire Alerts side by side */}
        <div className="grid lg:grid-cols-5 gap-5 mb-5">

          {/* Live Fire Map */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <h3 className="text-gray-900 font-bold">Live Fire Map</h3>
                <span className="text-xs bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded-full font-medium">Live</span>
              </div>
              <Link href="/map" className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1">
                Full Map <ChevronRight size={12} />
              </Link>
            </div>
            <div className="h-[420px] relative">
              <FireMap compact={true} />
            </div>
          </div>

          {/* Fire Alerts — moved up, now prominent */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-gray-900 font-bold flex items-center gap-2">
                <Bell size={16} className="text-orange-400" /> Fire Alerts Near You
              </h3>
              <div className="flex items-center gap-2">
                <select value={alertRadius} onChange={e => setAlertRadius(Number(e.target.value))} className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1">
                  {[10,25,50,100].map(r => <option key={r} value={r}>{r} mi</option>)}
                </select>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center gap-2 flex-shrink-0">
              <MapPin size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs truncate font-medium">Monitoring within {alertRadius} miles</span>
            </div>
            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
              {mockAlerts.filter(a => parseFloat(a.distance) <= alertRadius).map((alert, i) => (
                <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${alert.active ? 'bg-red-50 border border-red-200' : 'bg-gray-100'}`}>
                      <Flame size={14} className={alert.active ? 'text-red-500' : 'text-gray-500'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-gray-900 text-sm font-medium">{alert.name}</p>
                        {alert.active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      </div>
                      <p className="text-gray-500 text-xs">{alert.distance} away · {alert.acres.toLocaleString()} acres</p>
                      <p className="text-gray-400 text-xs">{alert.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${alert.contained === 100 ? 'text-green-500' : alert.contained > 50 ? 'text-yellow-500' : 'text-orange-500'}`}>{alert.contained}%</p>
                    <p className="text-gray-500 text-xs">contained</p>
                  </div>
                </div>
              ))}
              {mockAlerts.filter(a => parseFloat(a.distance) <= alertRadius).length === 0 && (
                <div className="px-5 py-10 text-center">
                  <CheckCircle size={28} className="text-green-400 mx-auto mb-2" />
                  <p className="text-gray-900 text-sm font-medium">No active fires within {alertRadius} miles</p>
                  <p className="text-gray-500 text-xs mt-1">Increase radius to see more alerts</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
              <Link href="/dashboard/alerts" className="flex items-center justify-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors">
                <Bell size={14} /> Manage Alert Settings <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Grid — top row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">

          {/* Contact Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 card-hover shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-orange-400" />
                <h3 className="text-gray-900 font-bold">Contact Details</h3>
              </div>
              <Link href="/dashboard/profile" className="text-orange-500 hover:text-orange-600 text-xs transition-colors">Edit</Link>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs">Full Name</p>
                <p className="text-gray-900 text-sm font-medium">
                  {profileName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="text-gray-900 text-sm font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Phone</p>
                <p className="text-gray-900 text-sm font-medium">{profilePhone || 'Not added yet'}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-xs">Coverage Status</p>
                <p className={`text-base font-black mt-0.5 ${coverageStatusConfig[coverageStatus].color}`}>{coverageStatusConfig[coverageStatus].label}</p>
                <Link href="/dashboard/bids" className="text-orange-500 hover:text-orange-600 text-xs mt-1 inline-flex items-center gap-1 transition-colors">
                  {coverageStatus === 'not_covered' ? 'Submit an application' : 'View application'} <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Protected Addresses */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 card-hover shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-orange-400" />
                <h3 className="text-gray-900 font-bold">Protected Address</h3>
              </div>
              {addresses.length > 0 && (
                <Link href="/dashboard/profile" className="text-orange-500 hover:text-orange-600 text-xs transition-colors">Edit</Link>
              )}
            </div>
            <div className="space-y-3">
              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3">
                    <MapPin size={20} className="text-orange-300" />
                  </div>
                  <p className="text-gray-700 text-sm font-medium mb-1">No address added yet</p>
                  <p className="text-gray-500 text-xs mb-4">Add your property address to enable fire monitoring and alerts.</p>
                  <Link href="/dashboard/bids" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full btn-glow transition-all">
                    <Plus size={13} /> Add Address in Application
                  </Link>
                </div>
              ) : (
                <>
                  {addresses.map((addr, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-gray-900 text-sm font-semibold">{addr.label}</p>
                        <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                          <CheckCircle size={10} className="inline mr-0.5" /> Added
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{addr.address}</p>
                      <p className="text-gray-500 text-xs">{addr.city}, {addr.state} {addr.zip}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-orange-400">
                        <MapPin size={11} /> ZIP {addr.zip}
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/profile" className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-orange-400 rounded-xl py-2.5 text-gray-500 hover:text-orange-500 text-xs font-medium transition-all">
                    + Add Another Address
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Click to Call */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 card-hover shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={16} className="text-orange-400" />
              <h3 className="text-gray-900 font-bold">Emergency Contact</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500 text-xs mb-0.5">Your Assigned Team</p>
                <p className="text-gray-900 font-bold">Unit 7 — Malibu Station</p>
                <p className="text-gray-500 text-xs mt-1">Capt. Rodriguez · 8 personnel</p>
              </div>
              <a href="tel:8184141980" className="flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-full btn-glow transition-all w-full">
                <Phone size={18} className="fire-pulse" /> Call Now: 818-414-1980
              </a>
              <a href="tel:911" className="flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-3 rounded-full transition-all w-full text-sm">
                🚨 Emergency: 911
              </a>
              <div className="flex items-center gap-2 text-green-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Team on standby · Response time ~8 min
              </div>
            </div>
          </div>
        </div>

        {/* Fire Risk */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 card-hover shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-400" />
            <h3 className="text-gray-900 font-bold">Fire Risk Level — ZIP 90265</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className={`rounded-xl border p-4 mb-4 ${riskData.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xl font-black ${riskData.color}`}>{riskData.level} Risk</span>
                  <span className={`text-2xl font-black ${riskData.color}`}>{riskData.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${riskData.score}%` }} />
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">Based on proximity to wildland-urban interface, historical fire frequency, fuel load, and current wind conditions.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Fuel Load','High'],['Wind Risk','Moderate'],['Access','Good'],['Defensible Space','Fair']].map(([k,v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">{k}</p>
                  <p className="text-gray-900 text-sm font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row — Timeline, Alert Settings, Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-5">
            {/* Protection Timeline */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-orange-400" /> Protection Timeline
              </h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, label: 'Account Created', detail: 'Complete', done: true },
                  { icon: FileText, label: 'Application Submitted', detail: hasSubmittedApplication ? 'Submitted' : 'Not yet submitted', done: hasSubmittedApplication },
                  { icon: Zap, label: 'Property Assessment', detail: isApplicationApproved ? 'Assessment in progress' : 'Scheduled after approval', done: isApplicationApproved },
                  { icon: Shield, label: 'Protection Active', detail: isApplicationApproved ? 'Coverage active' : 'Pending approval', done: isApplicationApproved },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-orange-50 border border-orange-200' : 'bg-gray-100 border border-gray-200'}`}>
                      <item.icon size={13} className={item.done ? 'text-orange-400' : 'text-gray-600'} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.done ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</p>
                      <p className="text-xs text-gray-600">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fire Alert Settings - prominent card */}
            <Link href="/dashboard/alerts" className="block bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-sm hover:from-orange-600 hover:to-orange-700 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bell size={16} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold">Fire Alert Settings</h3>
                </div>
                <ChevronRight size={16} className="text-white/70 group-hover:text-white transition-colors" />
              </div>
              <p className="text-orange-100 text-xs leading-relaxed">Configure notification channels, alert radius, and fire thresholds to stay informed in real time.</p>
            </Link>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/map', icon: MapPin, label: 'View Live Fire Map' },
                  { href: '/dashboard/bids', icon: FileText, label: 'My Application' },
                  { href: '/dashboard/profile', icon: User, label: 'Edit Profile' },
                ].map(item => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <item.icon size={14} className="text-orange-400" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 text-sm transition-colors">{item.label}</span>
                    <ChevronRight size={13} className="text-gray-600 ml-auto group-hover:text-gray-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

