'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Flame, Shield, MapPin, CheckCircle, Clock, AlertTriangle, ChevronRight, Search, User, Mail, Phone, Home, FileText, Star } from 'lucide-react'
import { californiaZipPrefixes } from '@/lib/mockData'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { upsertCoverageApplication, upsertUserProfile } from '@/lib/supabase/user-data'
import { computeRiskScore, fetchCalFireList } from '@/lib/calfire'
import { geocodeZip } from '@/lib/geocode'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ApplyPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [zip, setZip] = useState('')
  const [zipChecked, setZipChecked] = useState(false)
  const [available, setAvailable] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistDone, setWaitlistDone] = useState(false)
  const [riskLevel, setRiskLevel] = useState<'extreme'|'high'|'moderate'|'low'>('high')
  const [submitted, setSubmitted] = useState(false)
  const [appLoading, setAppLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: 'CA',
    propertyType: '', homeValue: '', currentInsurance: '',
    notes: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        console.error('Auth check error:', err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const checkZip = () => {
    if (zip.length < 5) return
    const isCA = californiaZipPrefixes.includes(zip.substring(0, 3))
    setAvailable(isCA)
    setZipChecked(true)
    setWaitlistDone(false)
  }

  useEffect(() => {
    const loadRisk = async () => {
      if (!zipChecked || zip.length !== 5) return
      try {
        const [center, incidents] = await Promise.all([geocodeZip(zip), fetchCalFireList(true)])
        if (!center) return
        const risk = computeRiskScore(incidents.filter(i => i.IsActive), center)
        const mapped: 'extreme' | 'high' | 'moderate' | 'low' =
          risk.level === 'Extreme' ? 'extreme' : risk.level === 'High' ? 'high' : risk.level === 'Moderate' ? 'moderate' : 'low'
        setRiskLevel(mapped)
      } catch {
        // Keep previously selected/default risk level on transient API failures.
      }
    }
    void loadRisk()
  }, [zip, zipChecked])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { window.location.href = '/signup'; return }
    setAppLoading(true)
    setSubmitError('')
    try {
      const supabase = getSupabaseBrowserClient()
      await upsertCoverageApplication(supabase, {
        user_id: user.id,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        zip: zip.trim(),
        property_type: form.propertyType,
        home_value: form.homeValue,
        has_insurance: form.currentInsurance,
        additional_info: form.notes.trim() || null,
        submitted: true,
        submitted_at: new Date().toISOString(),
      })

      await upsertUserProfile(supabase, {
        user_id: user.id,
        first_name: form.firstName.trim() || null,
        last_name: form.lastName.trim() || null,
        phone: form.phone.trim() || null,
        address_line1: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim().toUpperCase() || null,
        zip_code: zip.trim() || null,
        coverage_status: 'pending',
      })

      await fetch('/api/applications/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submitted',
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim().toUpperCase(),
          zip: zip.trim(),
          propertyType: form.propertyType,
          homeValue: form.homeValue,
          currentInsurance: form.currentInsurance,
          notes: form.notes.trim(),
        }),
      }).catch((error) => {
        // Application save is primary; email notification failures are logged server-side.
        console.error('Application email notify request failed:', error)
      })

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit application.')
    } finally {
      setAppLoading(false)
    }
  }

  const riskColors: Record<string, { bar: string; badge: string; text: string }> = {
    extreme: { bar: 'bg-red-600', badge: 'bg-red-50 border-red-200 text-red-700', text: 'text-red-700' },
    high:    { bar: 'bg-orange-500', badge: 'bg-orange-50 border-orange-200 text-orange-700', text: 'text-orange-700' },
    moderate:{ bar: 'bg-yellow-500', badge: 'bg-yellow-50 border-yellow-200 text-yellow-700', text: 'text-yellow-700' },
    low:     { bar: 'bg-green-500', badge: 'bg-green-50 border-green-200 text-green-700', text: 'text-green-700' },
  }

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <div className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
              <Flame size={13} className="text-orange-500" />
              <span className="text-orange-600 text-xs font-medium">Private Fire Protection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Apply for Fire Protection
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-base leading-relaxed">
              Tell us about your property and we'll match you with the right private fire protection plan. Start by checking if we cover your area.
            </p>
          </div>

          {/* ── STEP 1: ZIP CHECK ── */}
          <div className="relative mb-8 rounded-3xl overflow-hidden border-2 border-orange-300 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-[#f8f7f5]" />
            <div className="relative p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow">
                  <Search size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900 font-black text-xl">Step 1 — Check Your Area</h2>
                  <p className="text-orange-600 text-xs">Enter your ZIP to confirm coverage availability</p>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  value={zip}
                  onChange={e => setZip(e.target.value.replace(/\D/g,'').slice(0,5))}
                  onKeyDown={e => e.key === 'Enter' && checkZip()}
                  placeholder="California ZIP code (e.g. 90265)"
                  className="flex-1 bg-white border-2 border-gray-300 focus:border-orange-500 rounded-2xl px-5 py-4 text-gray-900 text-lg font-medium placeholder-gray-400 outline-none transition-colors"
                  maxLength={5}
                />
                <button onClick={checkZip}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl text-base btn-glow transition-all flex items-center gap-2 flex-shrink-0">
                  <Search size={18} /> Check
                </button>
              </div>

              {zipChecked && (
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {available ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-green-700 font-bold text-sm">Coverage Available — ZIP {zip}</span>
                      </div>
                      <p className="text-gray-600 text-xs">Great news! Private Fire serves your area. Complete the application below.</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-yellow-500" />
                        <span className="text-yellow-700 font-bold text-sm">Not Yet Available — ZIP {zip}</span>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">We&apos;re expanding. Join the waitlist and we&apos;ll notify you when we reach your area.</p>
                      {!waitlistDone ? (
                        <div className="flex gap-2">
                          <input
                            value={waitlistEmail}
                            onChange={e => setWaitlistEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 bg-white border border-yellow-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500"
                          />
                          <button onClick={() => setWaitlistDone(true)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap">
                            Join
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                          <CheckCircle size={13} /> You&apos;re on the waitlist!
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`border rounded-2xl p-4 ${riskColors[riskLevel].badge}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} />
                      <span className="font-bold text-sm capitalize">Fire Risk: {riskLevel}</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-1.5 mb-1">
                      <div className={`h-1.5 rounded-full ${riskColors[riskLevel].bar}`}
                        style={{ width: riskLevel === 'extreme' ? '95%' : riskLevel === 'high' ? '70%' : riskLevel === 'moderate' ? '45%' : '20%' }} />
                    </div>
                    <p className="text-xs opacity-80 mt-1">Based on historical fire data for ZIP {zip}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── STEP 2: APPLICATION FORM (only shown if ZIP is available) ── */}
          {zipChecked && available && (
            submitted ? (
              /* Success state */
              <div className="bg-white border border-green-200 rounded-3xl p-10 text-center shadow-sm mb-8">
                <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Application Received!</h2>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">
                  Thank you for applying for Private Fire protection. Our team will review your application and contact you within <strong className="text-gray-900">2–3 business days</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-8">A confirmation has been sent to <strong>{form.email}</strong>.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full btn-glow transition-all text-sm">
                    Go to Dashboard
                  </Link>
                  <Link href="/" className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full transition-all text-sm shadow-sm">
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-8">
                  {/* Form header */}
                  <div className="bg-gradient-to-r from-orange-50 to-white px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
                        <FileText size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-gray-900 font-black text-xl">Step 2 — Your Application</h2>
                        <p className="text-gray-500 text-xs">All fields required unless marked optional</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-7">

                    {/* Personal info */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User size={15} className="text-orange-500" />
                        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 font-medium mb-1.5">First Name</label>
                          <input required value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} placeholder="John" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 font-medium mb-1.5">Last Name</label>
                          <input required value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} placeholder="Smith" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 font-medium mb-1.5">Email Address</label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="john@example.com" className={`${inputClass} pl-9`} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 font-medium mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 (555) 000-0000" className={`${inputClass} pl-9`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Property info */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Home size={15} className="text-orange-500" />
                        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide">Property Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-600 font-medium mb-1.5">Property Address</label>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="123 Oak Ridge Drive" className={`${inputClass} pl-9`} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="col-span-1 sm:col-span-1">
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">City</label>
                            <input required value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} placeholder="Malibu" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">State</label>
                            <input value="CA" disabled className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">ZIP Code</label>
                            <input value={zip} disabled className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Property Type</label>
                            <select required value={form.propertyType} onChange={e => setForm(f => ({...f, propertyType: e.target.value}))} className={inputClass}>
                              <option value="">Select type</option>
                              <option>Single Family Home</option>
                              <option>Estate / Ranch</option>
                              <option>Multi-Family</option>
                              <option>Vacation / Second Home</option>
                              <option>Commercial Property</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Estimated Home Value</label>
                            <select required value={form.homeValue} onChange={e => setForm(f => ({...f, homeValue: e.target.value}))} className={inputClass}>
                              <option value="">Select range</option>
                              <option>Under $500K</option>
                              <option>$500K – $1M</option>
                              <option>$1M – $2M</option>
                              <option>$2M – $5M</option>
                              <option>Over $5M</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Current Fire Insurance?</label>
                            <select required value={form.currentInsurance} onChange={e => setForm(f => ({...f, currentInsurance: e.target.value}))} className={inputClass}>
                              <option value="">Select</option>
                              <option>Yes — active policy</option>
                              <option>No — uninsured</option>
                              <option>Policy was cancelled</option>
                              <option>In the process of obtaining</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Additional notes */}
                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-1.5">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                        placeholder="Tell us anything else about your property, situation, or specific concerns..."
                        rows={3} className={`${inputClass} resize-none`} />
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
                          {submitError}
                        </div>
                      )}
                      {!user && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
                          <AlertTriangle size={15} className="text-orange-500 flex-shrink-0 mt-0.5" />
                          <p className="text-orange-700 text-sm">
                            You need an account to apply.{' '}
                            <Link href="/signup" className="font-bold underline">Create a free account</Link>
                            {' '}or{' '}
                            <Link href="/login" className="font-bold underline">sign in</Link>.
                          </p>
                        </div>
                      )}
                      <button type="submit" disabled={appLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-4 rounded-2xl btn-glow transition-all text-base flex items-center justify-center gap-2">
                        <Flame size={18} />
                        {appLoading ? 'Submitting Application...' : 'Submit Application for Coverage'}
                      </button>
                      <p className="text-center text-gray-400 text-xs mt-3">
                        By submitting you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )
          )}

          {/* ── What's Included + How It Works (always visible) ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* What's included */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <Shield size={16} className="text-orange-500" /> What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {[
                  'Dedicated private firefighter assigned to your property',
                  'Annual home hardening & vulnerability assessment',
                  'Emergency deployment during active fire threats',
                  'Real-time fire risk monitoring dashboard',
                  'Priority emergency alerts within 25-mile radius',
                  '24/7 team contact via app and phone',
                  'State-of-the-art fire trucks & CA-certified equipment',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How it works */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <ChevronRight size={16} className="text-orange-500" /> How It Works
              </h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Check Your ZIP', desc: 'Confirm we serve your area and see your local fire risk level.' },
                  { step: '02', title: 'Submit Your Application', desc: 'Fill out the form above with your property details.' },
                  { step: '03', title: 'We Review & Contact You', desc: 'Our team reviews within 2–3 business days and reaches out to discuss your plan.' },
                  { step: '04', title: 'Get Protected', desc: 'Your dedicated firefighter is assigned and monitoring begins immediately.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 text-orange-500 font-black text-xs">{item.step}</div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-gray-900 font-bold mb-5 text-center">What Our Clients Say</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { quote: "When the Palisades fire came within a mile of our home, the Private Fire team was already on our property. Worth every penny.", name: "Michael K.", location: "Pacific Palisades, CA" },
                { quote: "I cancelled my traditional insurance and went with Private Fire. Real firefighters protecting my home — not just a check after it's gone.", name: "Sarah R.", location: "Malibu, CA" },
                { quote: "The annual assessment alone identified three major vulnerabilities we had no idea about. These people know fire.", name: "James D.", location: "Topanga, CA" },
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f97316" className="text-orange-500" />)}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed italic mb-3">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-gray-900 text-xs font-bold">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
