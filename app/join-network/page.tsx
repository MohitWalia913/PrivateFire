'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import { Flame, Shield, Truck, MapPin, CheckCircle, Users, Star, ChevronRight, Building2, Phone, Mail, FileText, Award } from 'lucide-react'

const EQUIPMENT_OPTIONS = [
  'Type 1 Engine',
  'Type 3 Engine',
  'Water Tender',
  'Brush Truck',
  'Hand Crew',
  'Other',
]

const YEARS_OPTIONS = [
  { value: 'under1', label: 'Under 1 year' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10plus', label: '10+ years' },
]

const INSURANCE_OPTIONS = [
  { value: '1m-2m', label: '$1M–$2M' },
  { value: '2m-5m', label: '$2M–$5M' },
  { value: '5mplus', label: '$5M+' },
]

const PROCESS_STEPS = [
  { step: '01', title: 'Application', desc: 'Submit your partner application with company details, equipment list, and license info.' },
  { step: '02', title: 'Credential Verification', desc: 'Our team verifies your CA fire license, insurance coverage, and equipment inventory.' },
  { step: '03', title: 'Interview', desc: 'A 30-minute call with our partnerships team to discuss coverage zones and expectations.' },
  { step: '04', title: 'Background Check', desc: 'All personnel undergo background screening in compliance with CA regulations.' },
  { step: '05', title: 'Onboarding', desc: 'Get set up with our dispatch software, branding kit, and your first client assignments.' },
]

export default function JoinNetworkPage() {
  const [equipment, setEquipment] = useState<string[]>([])
  const [yearsInBusiness, setYearsInBusiness] = useState('')
  const [insuranceCoverage, setInsuranceCoverage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    operatingArea: '',
    personnel: '',
    licenseNumber: '',
    website: '',
    teamDescription: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleEquipment = (item: string) => {
    setEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <div className="pt-20 min-h-screen bg-[#f8f7f5]">

        {/* HERO */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f5] via-[#fff5ec] to-[#f8f7f5]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Join Our Network</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] mb-6 max-w-4xl mx-auto">
              Are You a Licensed Firefighter{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                or Fire Protection Company?
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Private Fire is expanding its network of elite firefighting professionals across California. Apply to become a certified Private Fire partner and serve high-value residential clients in your area.
            </p>
            <a href="#apply-form" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full btn-glow transition-all text-base">
              <Shield size={18} /> Apply to Join <ChevronRight size={16} />
            </a>
          </div>
        </section>

        {/* WHAT WE'RE LOOKING FOR */}
        <section className="py-20 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Star size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Qualifications</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">What We&apos;re Looking For</h2>
              <p className="text-gray-600 max-w-xl mx-auto">We partner only with fully licensed, insured, and equipped fire professionals who meet California&apos;s highest standards.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Award size={28} className="text-orange-400" />,
                  title: 'Licensed & Insured',
                  items: ['Valid CA fire protection license', '$2M+ liability insurance coverage', 'Current compliance with CAL FIRE regulations', 'All personnel background-cleared'],
                },
                {
                  icon: <Truck size={28} className="text-orange-400" />,
                  title: 'Equipment Ready',
                  items: ['Type 1 or Type 3 engine, pumpers, or equivalent', 'Apparatus inspected and maintained', 'SCBA and full PPE for all personnel', 'Communications gear compatible with ICS'],
                },
                {
                  icon: <MapPin size={28} className="text-orange-400" />,
                  title: 'Local Coverage',
                  items: ['Operating within defined CA response zones', 'Ability to mobilize within 60 minutes', 'Familiarity with local terrain and access roads', 'Willing to accept dispatch via our platform'],
                },
              ].map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-6 card-hover shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-4">{card.title}</h3>
                  <ul className="space-y-2.5">
                    {card.items.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER BENEFITS */}
        <section className="py-20 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Shield size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Why Join Us</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Partner Benefits</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Joining Private Fire connects you with high-value clients, provides guaranteed revenue, and equips your team with the tools to work smarter.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: <FileText size={22} className="text-orange-400" />,
                  title: 'Guaranteed Contract Minimums',
                  desc: 'Every partner receives guaranteed annual contract minimums based on your zone and capacity — no chasing work.',
                },
                {
                  icon: <Building2 size={22} className="text-orange-400" />,
                  title: 'Premium Client Base',
                  desc: 'Serve high-net-worth homeowners and estates across California who are committed to protecting their properties.',
                },
                {
                  icon: <Star size={22} className="text-orange-400" />,
                  title: 'Private Fire Branding Support',
                  desc: 'Leverage the Private Fire brand, co-branded marketing materials, and a certified partner badge for your vehicles and website.',
                },
                {
                  icon: <Flame size={22} className="text-orange-400" />,
                  title: 'Dispatch Software Access',
                  desc: 'Get full access to our dispatch platform with real-time fire data, client assignment management, and incident reporting tools.',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="bg-white border border-gray-200 rounded-2xl p-6 card-hover shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply-form" className="py-20 bg-[#f2f0ed]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Users size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Partner Application</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Apply to Join the Network</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Fill out the form below and our partnerships team will review your application within 5 business days.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5">
                    <CheckCircle size={30} className="text-green-400" />
                  </div>
                  <h3 className="text-gray-900 font-black text-2xl mb-2">Application Received!</h3>
                  <p className="text-gray-600 max-w-sm">
                    Our partnerships team will review and contact you within 5 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Company / Organization Name */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Company / Organization Name <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        required
                        placeholder="Acme Fire Protection LLC"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* First + Last Name */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Contact First Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="John"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Contact Last Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Smith"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Email <span className="text-orange-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@company.com"
                          className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Phone <span className="text-orange-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="(818) 555-0000"
                          className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Area */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Operating Area / ZIP Codes Covered <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        name="operatingArea"
                        value={form.operatingArea}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Malibu, Pacific Palisades — 90265, 90272"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Years in Business */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Years in Business <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={yearsInBusiness}
                      onChange={e => setYearsInBusiness(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-white">Select years in business…</option>
                      {YEARS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} className="bg-white">{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Equipment Available */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-3">
                      Equipment Available <span className="text-orange-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EQUIPMENT_OPTIONS.map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleEquipment(item)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            equipment.includes(item)
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-gray-900'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Personnel */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Number of Personnel <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        name="personnel"
                        value={form.personnel}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="e.g. 12"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* CA Fire License Number */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      CA Fire License Number <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <Award size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. CAL-FP-123456"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Insurance Coverage Amount */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Insurance Coverage Amount <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={insuranceCoverage}
                      onChange={e => setInsuranceCoverage(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-white">Select coverage amount…</option>
                      {INSURANCE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} className="bg-white">{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Website (optional) */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Website <span className="text-gray-600 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                    />
                  </div>

                  {/* Tell us about your team */}
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">
                      Tell us about your team <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                      name="teamDescription"
                      value={form.teamDescription}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your team's experience, past deployment history, notable projects, and what makes you a great fit for Private Fire…"
                      className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full btn-glow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <Flame size={18} /> Submit Partner Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="py-20 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <ChevronRight size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">What Happens Next</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">The Partner Process</h2>
              <p className="text-gray-600 max-w-xl mx-auto">From application to your first dispatch, here is what to expect when you join the Private Fire network.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {PROCESS_STEPS.map((s) => (
                <div key={s.step} className="relative bg-white border border-gray-200 rounded-2xl p-6 card-hover text-center shadow-sm">
                  <div className="text-orange-500/20 font-black text-5xl absolute top-3 right-4 select-none">{s.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-200 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-orange-400 font-black text-lg">{s.step}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
