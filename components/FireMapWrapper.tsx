'use client'

import dynamic from 'next/dynamic'
import { Flame } from 'lucide-react'

const FireMap = dynamic(() => import('./FireMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#272727] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center fire-pulse">
          <Flame size={28} className="text-orange-400" />
        </div>
        <p className="text-white font-semibold">Loading California Fire Map...</p>
        <p className="text-gray-500 text-sm">Connecting to CAL FIRE data</p>
      </div>
    </div>
  )
})

export default function FireMapWrapper() {
  return <FireMap />
}
