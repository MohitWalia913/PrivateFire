'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    description: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Contact{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Us
              </span>
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              We&apos;re here to help — reach out and we&apos;ll respond within 24 hours.
            </p>
          </div>

          {/* Prominent email card */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Mail size={26} className="text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Email us directly</p>
              <a
                href="mailto:info@privatefire.com"
                className="text-2xl font-black text-gray-900 hover:text-orange-500 transition-colors"
              >
                info@privatefire.com
              </a>
              <p className="text-gray-500 text-xs mt-1">We respond within 24 hours</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left: contact info cards */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  icon: <Phone size={18} className="text-orange-400" />,
                  label: 'Phone',
                  value: '818-414-1980',
                  sub: 'Call or text anytime',
                  href: 'tel:8184141980',
                },
                {
                  icon: <Mail size={18} className="text-orange-400" />,
                  label: 'Email',
                  value: 'info@privatefire.com',
                  sub: 'We reply within 24 hours',
                  href: 'mailto:info@privatefire.com',
                },
                {
                  icon: <MapPin size={18} className="text-orange-400" />,
                  label: 'Address',
                  value: 'Los Angeles, California',
                  sub: 'Serving all of CA',
                  href: null,
                },
                {
                  icon: <Clock size={18} className="text-orange-400" />,
                  label: 'Hours',
                  value: '24/7 Emergency',
                  sub: 'Mon–Fri 9am–6pm Office',
                  href: null,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-900 font-semibold text-sm hover:text-orange-500 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-semibold text-sm">{item.value}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-900 font-semibold text-sm mb-2">Back to site</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm transition-colors"
                >
                  <Flame size={13} /> Return to Home
                </Link>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5">
                      <CheckCircle size={30} className="text-green-400" />
                    </div>
                    <h2 className="text-gray-900 font-black text-2xl mb-2">Message Sent!</h2>
                    <p className="text-gray-600 max-w-xs">
                      We&apos;ll be in touch within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', reason: '', description: '' }) }}
                      className="mt-8 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-gray-900 font-bold text-lg mb-1">Send Us a Message</h2>
                    <p className="text-gray-500 text-sm mb-5">
                      Fill out the form below and our team will get back to you shortly.
                    </p>

                    {/* Full Name */}
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Full Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Phone <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="(818) 555-0000"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Email <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@email.com"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Reason for Contact <span className="text-orange-400">*</span>
                      </label>
                      <select
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a reason…</option>
                        <option value="interested">Interested in Service</option>
                        <option value="support">Support</option>
                        <option value="advertising">Advertising</option>
                        <option value="problem">Report a Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-gray-600 text-xs font-medium mb-1.5">
                        Description <span className="text-orange-400">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help…"
                        className="w-full bg-white border border-gray-300 focus:border-orange-500 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Send size={15} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
