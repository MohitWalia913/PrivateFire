'use client'   

import { useState } from 'react'
import { X, Flame, CheckCircle, Phone, Mail, User } from 'lucide-react'

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() 
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch { /* best effort */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={20} />
          </button>   
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div> 
            <div>
              <h2 className="text-white font-bold text-lg">Private Fire Protection</h2>
              <p className="text-orange-100 text-sm">Get a free consultation from our team</p>
            </div>
          </div>
        </div>

        <div className="p-6"> 
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle size={52} className="text-green-400" />
              <h3 className="text-gray-900 font-bold text-xl">Request Received!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our fire protection specialists will contact you within 24 hours to discuss your property&apos;s needs.
              </p>
              <button onClick={onClose} className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-full btn-glow transition-all text-sm">
                Close
              </button>
            </div>
          ) : (
            <>  
              <p className="text-gray-600 text-sm mb-5">   
                Leave your details and our team will reach out to discuss private fire protection for your property.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-medium">First Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        required
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="John"
                        className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-medium">Last Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        required
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Smith"
                        className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Phone Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Email Address *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-full btn-glow transition-all text-sm mt-2"
                >
                  {loading ? 'Sending...' : 'Request Free Consultation'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
