'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Flame,
  Shield,
  Home,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  FileText,
  ClipboardList,
  Users,
  Calendar,
} from 'lucide-react'
import Footer from '@/components/Footer'

const featureCards = [
  {
    icon: <MapPin size={24} className="text-orange-400" />,
    title: 'Property Perimeter Inspection',
    desc: 'Our specialists walk the full perimeter of your property identifying ignition vectors, fuel accumulation, and structural vulnerabilities from the outside in.',
  },
  {
    icon: <Flame size={24} className="text-orange-400" />,
    title: 'Vegetation & Fuel Load Analysis',
    desc: 'We assess plant species, density, moisture content, and proximity to the structure — the key factors that determine how fast and hot a fire will approach.',
  },
  {
    icon: <FileText size={24} className="text-orange-400" />,
    title: 'Structural Vulnerability Report',
    desc: 'A written report documenting every point of structural weakness — vents, eaves, siding gaps, deck materials, and fencing that could allow ember intrusion.',
  },
  {
    icon: <Shield size={24} className="text-orange-400" />,
    title: 'Personalized Defense Plan',
    desc: 'You receive a prioritized, actionable defense plan tailored to your specific property, budget, and risk level — not a generic handout.',
  },
]

const differentiators = [
  {
    icon: <Users size={20} className="text-orange-400" />,
    title: 'Firefighter-Led Assessment',
    desc: 'Our assessors are active or retired firefighters — not contractors or salespeople. They understand exactly how fire behaves and what stops it.',
  },
  {
    icon: <ClipboardList size={20} className="text-orange-400" />,
    title: 'Actionable Written Report',
    desc: 'You receive a formal written report with photos, priority rankings, and cost estimates — not just verbal advice that you\'ll forget within a week.',
  },
  {
    icon: <AlertTriangle size={20} className="text-orange-400" />,
    title: 'No Sales Agenda',
    desc: 'This is a genuine assessment service, not a lead-gen tactic. Our goal is to give you accurate information, not to upsell you on products.',
  },
]

const processSteps = [
  { step: '01', icon: <FileText size={20} />, title: 'Submit Application', desc: 'Complete the form below. We review all applications to prioritize the highest-risk properties first.' },
  { step: '02', icon: <ClipboardList size={20} />, title: 'Application Review', desc: 'Our team reviews your submission within 2 business days and determines eligibility and priority.' },
  { step: '03', icon: <Phone size={20} />, title: 'Scheduling Call', desc: 'We call you to confirm details, answer questions, and schedule a convenient time for the in-person visit.' },
  { step: '04', icon: <Home size={20} />, title: 'In-Person Visit', desc: 'A certified fire defense specialist visits your property and conducts a thorough 60–90 minute inspection.' },
  { step: '05', icon: <FileText size={20} />, title: 'Detailed Report', desc: 'Within 5 business days you receive your full written assessment with photos, findings, and your defense plan.' },
]

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  homeValue: string
  hasInsurance: string
  propertyType: string
  notes: string
}

export default function RiskAssessmentPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    homeValue: '',
    hasInsurance: '',
    propertyType: '',
    notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors'
  const labelClass = 'block text-gray-600 text-xs font-medium mb-1.5'

  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-0">

        {/* HERO */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f5] via-[#fff5ec] to-[#f8f7f5]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Free Risk Assessment</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-[1.08] mb-6 max-w-3xl mx-auto">
              Know Your Risk Before the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Fire Season
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Our certified fire defense specialists conduct in-person property assessments to identify your
              vulnerabilities and build a custom defense strategy — at no cost to you.
            </p>
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {[
                { icon: <CheckCircle size={16} />, label: 'Free Service' },
                { icon: <MapPin size={16} />, label: 'In-Person Visit' },
                { icon: <FileText size={16} />, label: 'Expert Report' },
              ].map((trust) => (
                <div
                  key={trust.label}
                  className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-5 py-2.5 justify-center"
                >
                  <span className="text-orange-400">{trust.icon}</span>
                  <span className="text-gray-900 font-semibold text-sm">{trust.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">What You Get</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">What&apos;s Included</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Every free assessment covers the four critical dimensions of wildfire vulnerability — nothing is skipped.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-500/40 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-gray-900 font-bold text-base mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE'RE DIFFERENT */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Why Choose Us</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">How We&apos;re Different</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Most fire inspections are quick walk-throughs by insurance adjusters. Ours are different.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Differentiator cards */}
              <div className="space-y-5">
                {differentiators.map((d) => (
                  <div key={d.title} className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-200 flex items-center justify-center flex-shrink-0">
                      {d.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-base mb-1">{d.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 text-center text-xs font-bold uppercase tracking-wider">
                  <div className="bg-gray-50 p-4 text-gray-500">Feature</div>
                  <div className="bg-orange-50 p-4 text-orange-600 border-x border-orange-200">Private Fire</div>
                  <div className="bg-gray-50 p-4 text-gray-500">Standard Inspection</div>
                </div>
                {[
                  ['Led by firefighters', true, false],
                  ['Written report with photos', true, false],
                  ['Personalized defense plan', true, false],
                  ['No sales pressure', true, false],
                  ['Available statewide', true, false],
                  ['Completely free', true, false],
                ].map(([label, us, them]) => (
                  <div key={label as string} className="grid grid-cols-3 text-center border-t border-gray-100">
                    <div className="p-4 text-gray-600 text-sm text-left">{label as string}</div>
                    <div className="p-4 border-x border-orange-100 flex items-center justify-center">
                      {us ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <span className="text-red-400 font-bold">✕</span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      {them ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <span className="text-red-400 font-bold">✕</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Apply Now</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Request Your Free Assessment</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Fill out the application below. We review all submissions and contact you within 2 business days.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5">
                    <CheckCircle size={30} className="text-green-400" />
                  </div>
                  <h3 className="text-gray-900 font-black text-2xl mb-2">Application Received!</h3>
                  <p className="text-gray-600 max-w-sm mb-8">
                    Thank you! We&apos;ll review your application and contact you within 2 business days to discuss
                    next steps.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setForm({
                        firstName: '', lastName: '', email: '', phone: '',
                        address: '', city: '', state: '', zip: '',
                        homeValue: '', hasInsurance: '', propertyType: '', notes: '',
                      })
                    }}
                    className="bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name <span className="text-orange-400">*</span></label>
                      <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-orange-400">*</span></label>
                      <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Smith" className={inputClass} />
                    </div>
                  </div>

                  {/* Contact row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address <span className="text-orange-400">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-orange-400">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="(818) 555-0000" className={inputClass} />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass}>Property Address <span className="text-orange-400">*</span></label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} required placeholder="123 Oak Ridge Drive" className={inputClass} />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>City <span className="text-orange-400">*</span></label>
                      <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="Malibu" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State <span className="text-orange-400">*</span></label>
                      <input type="text" name="state" value={form.state} onChange={handleChange} required placeholder="CA" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>ZIP Code <span className="text-orange-400">*</span></label>
                      <input type="text" name="zip" value={form.zip} onChange={handleChange} required placeholder="90265" className={inputClass} />
                    </div>
                  </div>

                  {/* Home Value */}
                  <div>
                    <label className={labelClass}>Estimated Home Value <span className="text-orange-400">*</span></label>
                    <select name="homeValue" value={form.homeValue} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" disabled className="bg-white">Select a range…</option>
                      <option value="under500k" className="bg-white">Under $500K</option>
                      <option value="500k-1m" className="bg-white">$500K – $1M</option>
                      <option value="1m-2m" className="bg-white">$1M – $2M</option>
                      <option value="2m-5m" className="bg-white">$2M – $5M</option>
                      <option value="over5m" className="bg-white">Over $5M</option>
                    </select>
                  </div>

                  {/* Insurance + Property Type */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Current Fire Insurance <span className="text-orange-400">*</span></label>
                      <select name="hasInsurance" value={form.hasInsurance} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="" disabled className="bg-white">Select…</option>
                        <option value="yes" className="bg-white">Yes</option>
                        <option value="no" className="bg-white">No</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Property Type <span className="text-orange-400">*</span></label>
                      <select name="propertyType" value={form.propertyType} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="" disabled className="bg-white">Select…</option>
                        <option value="single-family" className="bg-white">Single Family</option>
                        <option value="multi-family" className="bg-white">Multi-Family</option>
                        <option value="estate-ranch" className="bg-white">Estate / Ranch</option>
                        <option value="commercial" className="bg-white">Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Additional Notes <span className="text-gray-600">(optional)</span></label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us anything relevant about your property, concerns, or fire history in your area…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm btn-glow"
                  >
                    <Shield size={16} /> Request Assessment <ArrowRight size={16} />
                  </button>

                  <p className="text-gray-600 text-xs text-center leading-relaxed">
                    We review all applications before scheduling. Properties in extreme risk zones receive priority.
                    By submitting you agree to be contacted by a Private Fire specialist.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Calendar size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">The Process</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">What Happens Next</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                From application to your finished report — here&apos;s exactly what to expect.
              </p>
            </div>

            <div className="relative">
              {/* connector line */}
              <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {processSteps.map((step) => (
                  <div key={step.step} className="relative bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-orange-400 transition-colors shadow-sm">
                    <div className="text-orange-500/20 font-black text-5xl absolute top-3 right-4 select-none leading-none">{step.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-200 flex items-center justify-center mb-4 text-orange-400 mx-auto relative z-10">
                      {step.icon}
                    </div>
                    <h3 className="text-gray-900 font-bold text-sm mb-2 relative z-10">{step.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed relative z-10">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
