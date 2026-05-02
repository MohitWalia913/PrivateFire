'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ChevronLeft, CheckCircle, Shield, Clock, AlertTriangle, Edit3, User, Home, Sparkles } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getCoverageApplication, upsertCoverageApplication, upsertUserProfile } from '@/lib/supabase/user-data'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type CoverageStatus = 'not_covered' | 'pending' | 'active'

type ZippopotamPlace = {
  'place name'?: string
  'state abbreviation'?: string
}

type ZippopotamResponse = {
  places?: ZippopotamPlace[]
}

export default function MyApplicationPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const [applicationStatus, setApplicationStatus] = useState<CoverageStatus>('not_covered')
  const [isEditing, setIsEditing] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [zipLookup, setZipLookup] = useState<'idle' | 'loading' | 'ok' | 'not_found' | 'error'>('idle')
  const lastFetchedZipRef = useRef('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    propertyType: 'Single Family Home',
    homeValue: '',
    hasInsurance: '',
    additionalInfo: '',
  })

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
        setForm(f => ({
          ...f,
          firstName: metadata?.first_name || '',
          lastName: metadata?.last_name || '',
          email: session.user.email || '',
          phone: metadata?.phone || '',
        }))

        const application = await getCoverageApplication(supabase, session.user.id)
        if (application) {
          setForm({
            firstName: application.first_name,
            lastName: application.last_name,
            email: application.email,
            phone: application.phone,
            address: application.address,
            city: application.city,
            state: application.state || 'CA',
            zip: application.zip,
            propertyType: application.property_type || 'Single Family Home',
            homeValue: application.home_value,
            hasInsurance: application.has_insurance,
            additionalInfo: application.additional_info || '',
          })
          setSubmitted(application.submitted)
          if (application.approved) {
            setApplicationStatus('active')
          } else if (application.submitted) {
            setApplicationStatus('pending')
          } else {
            setApplicationStatus('not_covered')
          }
        } else {
          setIsEditing(true)
        }
      } catch (err) {
        // This should not happen anymore since database functions handle errors gracefully
        console.error('Unexpected application initialization error:', err instanceof Error ? err.message : err || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isEditing) return

    const zip = form.zip.replace(/\D/g, '').slice(0, 5)
    if (zip.length !== 5) {
      lastFetchedZipRef.current = ''
      setZipLookup('idle')
      return
    }

    if (lastFetchedZipRef.current === zip) return

    const ac = new AbortController()
    setZipLookup('loading')

    void (async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: ac.signal })
        if (!res.ok) {
          lastFetchedZipRef.current = ''
          setZipLookup('not_found')
          return
        }
        const data = (await res.json()) as ZippopotamResponse
        const place = data.places?.[0]
        const city = place?.['place name']?.trim()
        const stateAbbr = place?.['state abbreviation']?.trim().toUpperCase()
        if (!city || !stateAbbr) {
          lastFetchedZipRef.current = ''
          setZipLookup('not_found')
          return
        }
        lastFetchedZipRef.current = zip
        setForm(f => ({ ...f, zip, city, state: stateAbbr }))
        setZipLookup('ok')
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'name' in e && (e as { name: string }).name === 'AbortError') return
        lastFetchedZipRef.current = ''
        setZipLookup('error')
      }
    })()

    return () => ac.abort()
  }, [form.zip, isEditing])

  const statusConfig = {
    not_covered: {
      label: 'Not Covered',
      color: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-200',
      Icon: AlertTriangle,
      iconColor: 'text-gray-400',
      detail: 'Submit your application below to request private fire protection.',
    },
    pending: {
      label: 'Pending Review',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      Icon: Clock,
      iconColor: 'text-yellow-500',
      detail: 'Your application is under review. Our team will contact you within 1–2 business days.',
    },
    active: {
      label: 'Active',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      Icon: CheckCircle,
      iconColor: 'text-green-500',
      detail: 'Your property is actively covered by our private firefighting team.',
    },
  }

  const cfg = statusConfig[applicationStatus]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError('')
    try {
      const supabase = getSupabaseBrowserClient()
      const wasSubmitted = submitted

      await upsertCoverageApplication(supabase, {
        user_id: user.id,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        zip: form.zip.trim(),
        property_type: form.propertyType,
        home_value: form.homeValue,
        has_insurance: form.hasInsurance,
        additional_info: form.additionalInfo.trim() || null,
        submitted: true,
        submitted_at: wasSubmitted ? undefined : new Date().toISOString(),
      })

      // Keep application flow successful even if profile mirror fails.
      // This avoids blocking users when optional profile tables are out-of-sync.
      try {
        await upsertUserProfile(supabase, {
          user_id: user.id,
          first_name: form.firstName.trim() || null,
          last_name: form.lastName.trim() || null,
          phone: form.phone.trim() || null,
          address_line1: form.address.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim().toUpperCase() || null,
          zip_code: form.zip.trim() || null,
          coverage_status: 'pending',
        })
      } catch (profileErr) {
        console.error('Profile sync warning after application submit:', profileErr)
      }

      const notifyRes = await fetch('/api/applications/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: wasSubmitted ? 'updated' : 'submitted',
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim().toUpperCase(),
          zip: form.zip.trim(),
          propertyType: form.propertyType,
          homeValue: form.homeValue,
          currentInsurance: form.hasInsurance,
          notes: form.additionalInfo.trim(),
        }),
      })

      if (!notifyRes.ok) {
        console.error('Application email notify failed:', await notifyRes.text())
      }

      setSubmitted(true)
      setApplicationStatus('pending')
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save application.')
    } finally {
      setSaving(false)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 text-sm">My Application</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Application</h1>
          <p className="text-gray-600 mt-1 text-sm max-w-3xl">
            Request private fire protection with tiered coverage. Your quote reflects property risk, location, and the response priority you choose.
          </p>
        </div>

        {/* Pricing overview — responsive grid */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-orange-500" />
            <h2 className="text-gray-900 font-bold">Coverage &amp; pricing</h2>
          </div>
          <p className="text-gray-500 text-xs mb-6 leading-relaxed max-w-3xl">
            Membership is structured in clear tiers—no auctions or price wars. You receive a tailored proposal after we review your application.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex flex-col h-full">
              <span className="text-orange-500 font-black text-sm tabular-nums">$10,000+</span>
              <p className="text-gray-900 text-sm font-semibold mt-2">Base coverage</p>
              <p className="text-gray-500 text-xs mt-1.5 flex-1">Entry tier for qualified properties. Final investment depends on risk level and location.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex flex-col h-full">
              <span className="text-orange-500 font-black text-sm">Priority</span>
              <p className="text-gray-900 text-sm font-semibold mt-2">Priority response</p>
              <p className="text-gray-500 text-xs mt-1.5 flex-1">Elevated dispatch and faster resource commitment—priced as a higher service tier.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex flex-col h-full sm:col-span-2 lg:col-span-1">
              <span className="text-orange-500 font-black text-sm">Custom</span>
              <p className="text-gray-900 text-sm font-semibold mt-2">High-risk estates &amp; large holdings</p>
              <p className="text-gray-500 text-xs mt-1.5 flex-1">Complex exposure or extensive acreage receives a custom scope and quote from our team.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main column — status + form */}
          <div className="lg:col-span-8 space-y-6 min-w-0">

        {/* Coverage Status Banner */}
        <div className={`border rounded-2xl p-5 ${cfg.bg}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center">
              <cfg.Icon size={22} className={cfg.iconColor} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-0.5">Coverage Status</p>
              <p className={`text-xl font-black ${cfg.color}`}>{cfg.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{cfg.detail}</p>
            </div>
          </div>
        </div>

        {/* Success confirmation */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 font-bold">Application Submitted!</p>
              <p className="text-green-600 text-sm mt-0.5">Our team will review your details and reach out within 1–2 business days.</p>
            </div>
          </div>
        )}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-bold flex items-center gap-2">
                <User size={16} className="text-orange-400" /> Personal Information
              </h2>
              {!isEditing && (
                <button type="button" onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-xs font-medium transition-colors">
                  <Edit3 size={13} /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First Name', key: 'firstName', placeholder: 'John' },
                { label: 'Last Name', key: 'lastName', placeholder: 'Smith' },
                { label: 'Email', key: 'email', placeholder: 'john@example.com' },
                { label: 'Phone', key: 'phone', placeholder: '(555) 000-0000' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-gray-500 text-xs mb-1.5 block">{label}</label>
                  {isEditing ? (
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm font-medium">{form[key as keyof typeof form] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
              <Home size={16} className="text-orange-400" /> Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">ZIP Code</label>
                {isEditing ? (
                  <>
                    <input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={form.zip}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
                        setForm(f => ({ ...f, zip: digits }))
                      }}
                      placeholder="90265"
                      maxLength={5}
                      className="w-full max-w-[11rem] bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400 tracking-wide"
                    />
                    <p className="text-gray-400 text-[11px] mt-1.5 leading-snug">
                      Enter a 5-digit U.S. ZIP — city and state fill in automatically when found.
                    </p>
                    {zipLookup === 'loading' && (
                      <p className="text-orange-500 text-[11px] mt-1 font-medium">Looking up location…</p>
                    )}
                    {zipLookup === 'not_found' && form.zip.length === 5 && (
                      <p className="text-amber-600 text-[11px] mt-1">ZIP not found — enter city and state manually.</p>
                    )}
                    {zipLookup === 'error' && form.zip.length === 5 && (
                      <p className="text-amber-600 text-[11px] mt-1">Could not look up ZIP — enter city and state manually.</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900 text-sm font-medium">{form.zip || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">Street Address</label>
                {isEditing ? (
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="123 Oak Ridge Drive"
                    className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400" />
                ) : (
                  <p className="text-gray-900 text-sm font-medium">{form.address || '—'}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">City</label>
                  {isEditing ? (
                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="Malibu"
                      className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400" />
                  ) : (
                    <p className="text-gray-900 text-sm font-medium">{form.city || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">State</label>
                  {isEditing ? (
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      placeholder="CA"
                      className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400" />
                  ) : (
                    <p className="text-gray-900 text-sm font-medium">{form.state}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Property Type</label>
                  {isEditing ? (
                    <select value={form.propertyType} onChange={e => setForm(f => ({ ...f, propertyType: e.target.value }))}
                      className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors">
                      {['Single Family Home', 'Multi-Family', 'Condo', 'Ranch / Estate', 'Commercial'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 text-sm font-medium">{form.propertyType}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Estimated Home Value</label>
                  {isEditing ? (
                    <input value={form.homeValue} onChange={e => setForm(f => ({ ...f, homeValue: e.target.value }))}
                      placeholder="$1,500,000"
                      className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400" />
                  ) : (
                    <p className="text-gray-900 text-sm font-medium">{form.homeValue || '—'}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">Do you have homeowners insurance?</label>
                {isEditing ? (
                  <div className="flex gap-3">
                    {['Yes', 'No', 'Not sure'].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, hasInsurance: opt }))}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.hasInsurance === opt ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900 text-sm font-medium">{form.hasInsurance || '—'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info (only in edit mode) */}
          {isEditing && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <FileText size={16} className="text-orange-400" /> Additional Information
              </h2>
              <textarea
                value={form.additionalInfo}
                onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                placeholder="Any details about your property, access, surroundings, or special concerns..."
                rows={4}
                className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none transition-colors placeholder-gray-400 resize-none"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button type="submit"
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-full btn-glow transition-all text-sm">
                  {saving ? 'Saving...' : submitted ? 'Update Application' : 'Submit Application'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}
                  className="bg-white border border-gray-200 text-gray-700 hover:text-gray-900 font-medium px-6 py-3 rounded-full text-sm transition-all">
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full btn-glow transition-all text-sm">
                <Edit3 size={15} />
                {submitted || applicationStatus !== 'not_covered' ? 'Update Application' : 'Start Application'}
              </button>
            )}
          </div>

        </form>

          </div>

          {/* Sidebar — process info (sticky on large screens) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-3">
              <Shield size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-700 font-semibold text-sm">How the approval process works</p>
                <p className="text-orange-600 text-xs mt-1 leading-relaxed">After you submit, we review your property for risk and location, then share a tiered coverage proposal (including any priority options you discuss with us). Once you enroll, your status updates to Active.</p>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  )
}
