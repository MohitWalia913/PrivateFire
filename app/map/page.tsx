import FireMapWrapper from '@/components/FireMapWrapper'
import { Flame } from 'lucide-react'

export default function MapPage() {
  return (
    <div className="flex flex-col mt-16 h-[calc(100vh-64px)]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-sm">California Active Fire Map</h1>
            <p className="text-gray-500 text-xs">Live data from CAL FIRE · Fire risk prediction layer</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Active Fire</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-500 inline-block opacity-70" /> High Risk Zone</span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <FireMapWrapper />
      </div>
    </div>
  )
}
