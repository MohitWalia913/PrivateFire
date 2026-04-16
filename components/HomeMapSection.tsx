'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Flame, Maximize2 } from 'lucide-react'

const FireMap = dynamic(() => import('./FireMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#ede9e4] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading fire map...</p>
      </div>
    </div>
  )
})

export default function HomeMapSection() {
  return (
    <section className="bg-[#f8f7f5] border-b border-gray-200">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Live Fire Map — California</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Real-Time Wildfire<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Tracking & Risk Prediction</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl text-sm leading-relaxed">
              Free for everyone. Track active fires across California, visualize historical risk zones, and get private protection right from the map.
            </p>
          </div>
          <Link href="/map" className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex-shrink-0 shadow-sm">
            <Maximize2 size={14} /> Full Screen Map
          </Link>
        </div>
      </div>

      {/* Map container */}
      <div className="h-[520px] relative">
        <FireMap compact={true} />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5 text-xs text-gray-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-yellow-400 inline-block" /> Critical fire (&lt;25% contained)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Active fire</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-900 inline-block opacity-80" /> Extreme risk zone</span>
        </div>
        <p className="text-xs text-gray-500">Data source: CAL FIRE · Updated every 5 min</p>
      </div>
    </section>
  )
}
