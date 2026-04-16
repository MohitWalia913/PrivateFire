import Link from 'next/link'
import {
  Flame,
  Shield,
  Home,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Leaf,
  Wind,
  Droplets,
  Phone,
  MapPin,
} from 'lucide-react'
import Footer from '@/components/Footer'

const roofItems = [
  {
    icon: <Shield size={20} className="text-orange-400" />,
    title: 'Ember-Resistant Vents',
    desc: 'Install 1/16" wire mesh screens on all attic, crawl space, and foundation vents to block ember intrusion.',
  },
  {
    icon: <Home size={20} className="text-orange-400" />,
    title: 'Class A Roofing Materials',
    desc: 'Use fire-rated asphalt shingles, metal, clay tile, or concrete tile — all rated Class A for maximum flame spread resistance.',
  },
  {
    icon: <Droplets size={20} className="text-orange-400" />,
    title: 'Metal Gutters with Mesh Guards',
    desc: 'Replace plastic gutters with non-combustible metal and add mesh guards to prevent debris and ember accumulation.',
  },
  {
    icon: <CheckCircle size={20} className="text-orange-400" />,
    title: 'Fire-Resistant Siding & Stucco',
    desc: 'Stucco, fiber cement, or brick siding dramatically reduces ember ignition risk on the exterior wall surfaces.',
  },
]

const landscapingItems = [
  {
    icon: <Leaf size={20} className="text-orange-400" />,
    title: '30ft Non-Combustible Zone',
    desc: 'Maintain a bare earth or gravel buffer within the first 5 feet of your foundation — no plants, mulch, or wood.',
  },
  {
    icon: <Wind size={20} className="text-orange-400" />,
    title: 'Space Plants Apart',
    desc: 'Keep shrubs and trees separated so fire cannot ladder from ground fuel to tree canopy. Prune lower branches to 6–10ft.',
  },
  {
    icon: <AlertTriangle size={20} className="text-orange-400" />,
    title: 'Remove Dead Vegetation',
    desc: 'Dead plants, leaves, and grass are the most dangerous fuels. Clear them annually — especially before fire season.',
  },
  {
    icon: <Flame size={20} className="text-orange-400" />,
    title: 'Avoid Wood Mulch Near Foundation',
    desc: 'Use gravel, decomposed granite, or rock mulch within Zone 0. Wood chips act as a wick for ember-driven ignition.',
  },
]

const prepItems = [
  {
    icon: <CheckCircle size={20} className="text-orange-400" />,
    title: 'Go-Bags Ready',
    desc: 'Prepare 72-hour emergency bags for each family member with documents, medications, water, and essentials.',
  },
  {
    icon: <MapPin size={20} className="text-orange-400" />,
    title: 'Evacuation Routes Mapped',
    desc: 'Know at least two exit routes from your neighborhood. Drive them in advance and share with every family member.',
  },
  {
    icon: <Shield size={20} className="text-orange-400" />,
    title: 'Important Docs Backed Up',
    desc: 'Scan and store insurance policies, IDs, deeds, and financial records in a secure cloud account.',
  },
  {
    icon: <Phone size={20} className="text-orange-400" />,
    title: 'Family Communication Plan',
    desc: 'Designate an out-of-area contact point, set meeting locations, and ensure every family member has the plan memorized.',
  },
]

export default function DefensePlansPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-0">

        {/* HERO */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f5] via-[#fff5ec] to-[#f8f7f5]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Defense Plans</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] mb-6 max-w-4xl mx-auto">
              Protect What Matters{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Before the Flames Arrive
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Proactive home defense is the most effective form of fire protection. Our step-by-step defense system
              helps California homeowners dramatically reduce their ignition risk before fire season.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/risk-assessment"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full btn-glow transition-all text-base"
              >
                <Shield size={18} /> Get Free Risk Assessment
              </Link>
              <Link
                href="/map"
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold px-8 py-4 rounded-full transition-all text-base shadow-sm"
              >
                <MapPin size={18} /> View Fire Map
              </Link>
            </div>
          </div>
        </section>

        {/* 5-ZONE DEFENSE SYSTEM */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Defensible Space</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">The 3-Zone Defense System</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                California Fire Code requires homeowners to maintain defensible space in concentric zones around their
                home. Each zone serves a specific purpose in slowing fire spread and protecting your structure.
              </p>
            </div>

            {/* Zone Diagram */}
            <div className="flex items-center justify-center mb-16">
              <div className="relative flex items-center justify-center" style={{ width: 560, height: 560 }}>
                {/* Zone 2 — outermost */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(251,191,36,0.08) 36%, rgba(251,191,36,0.12) 100%)' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20" />
                </div>
                {/* Zone 2 label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                  <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                    Zone 2 · 30–100ft · Reduced Fuel Zone
                  </span>
                </div>

                {/* Zone 1 ring */}
                <div className="absolute rounded-full flex items-center justify-center"
                  style={{ width: 360, height: 360, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(249,115,22,0.10) 41%, rgba(249,115,22,0.16) 100%)' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/30" />
                </div>
                {/* Zone 1 label */}
                <div className="absolute" style={{ top: 88 }}>
                  <span className="inline-block bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                    Zone 1 · 0–30ft · Non-Combustible Landscaping
                  </span>
                </div>

                {/* Zone 0 — home */}
                <div className="relative rounded-full flex items-center justify-center"
                  style={{ width: 180, height: 180, background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.20) 0%, rgba(239,68,68,0.08) 70%, transparent 100%)', border: '2px solid rgba(239,68,68,0.40)' }}>
                  <div className="text-center">
                    <Home size={36} className="text-red-400 mx-auto mb-1" />
                    <p className="text-gray-900 font-black text-sm">Zone 0</p>
                    <p className="text-red-600 text-xs">0–5ft</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">The Structure</p>
                  </div>
                </div>

                {/* Zone descriptions bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 text-center">
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                    <p className="text-red-600 text-xs font-bold">Zone 0</p>
                    <p className="text-gray-500 text-[10px]">Home itself</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                    <p className="text-orange-600 text-xs font-bold">Zone 1</p>
                    <p className="text-gray-500 text-[10px]">30ft buffer</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
                    <p className="text-yellow-700 text-xs font-bold">Zone 2</p>
                    <p className="text-gray-500 text-[10px]">30–100ft</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone explanation cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  zone: 'Zone 0',
                  range: '0–5 feet',
                  color: 'red',
                  borderColor: 'border-red-200',
                  bgColor: 'bg-red-50',
                  textColor: 'text-red-600',
                  desc: 'The home itself and immediate surroundings. This zone focuses on the structure — fire-resistant materials, ember-proof vents, non-combustible decking, and sealed gaps.',
                },
                {
                  zone: 'Zone 1',
                  range: '0–30 feet',
                  color: 'orange',
                  borderColor: 'border-orange-200',
                  bgColor: 'bg-orange-50',
                  textColor: 'text-orange-600',
                  desc: 'Lean, clean, and green. Irrigated plants with adequate spacing, no wood mulch, no combustible fences, and hardscaping elements that slow fire movement.',
                },
                {
                  zone: 'Zone 2',
                  range: '30–100 feet',
                  color: 'yellow',
                  borderColor: 'border-yellow-200',
                  bgColor: 'bg-yellow-50',
                  textColor: 'text-yellow-700',
                  desc: 'Reduced fuel zone. Remove dead plant material, create separation between plants, prune tree canopies, and mow grasses below 4 inches to prevent fire spread.',
                },
              ].map((z) => (
                <div key={z.zone} className={`bg-white border ${z.borderColor} rounded-2xl p-6 shadow-sm`}>
                  <div className={`inline-flex items-center gap-2 ${z.bgColor} border ${z.borderColor} rounded-full px-3 py-1 mb-4`}>
                    <span className={`${z.textColor} text-xs font-bold`}>{z.zone} · {z.range}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{z.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 ACTION ITEMS */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Action Checklist</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">12 Actions to Harden Your Home</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Organized into three categories — tackle them in order for the highest impact per dollar spent.
              </p>
            </div>

            <div className="space-y-12">
              {/* Roof & Structure */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Home size={18} className="text-orange-400" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl">Roof & Structure</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roofItems.map((item) => (
                    <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-500/40 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                        {item.icon}
                      </div>
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landscaping */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Leaf size={18} className="text-green-400" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl">Landscaping</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {landscapingItems.map((item) => (
                    <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-500/40 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                        <span className="text-green-400">{item.icon}</span>
                      </div>
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Preparedness */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-blue-400" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl">Emergency Preparedness</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {prepItems.map((item) => (
                    <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-500/40 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                        <span className="text-blue-400">{item.icon}</span>
                      </div>
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER COMPARISON */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Risk Comparison</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Protected vs. Unprotected</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                The difference between a home that survives a wildfire and one that doesn&apos;t often comes down to
                preparation made months before the fire arrives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Unprotected */}
              <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <h3 className="text-red-700 font-bold text-xl">Unprotected Home</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Wood shake or asphalt shingles easily ignited by embers',
                    'Plants and wood mulch touching the foundation',
                    'Plastic gutters filled with dry debris',
                    'No ember-blocking vent screens installed',
                    'Dense, un-pruned vegetation within 30ft',
                    'Dead grass and leaves accumulated under decks',
                    'No family evacuation plan in place',
                    'Critical documents stored only on-site',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-xs font-bold">✕</span>
                      </div>
                      <span className="text-gray-600 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protected */}
              <div className="bg-white border border-green-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle size={18} className="text-green-400" />
                  </div>
                  <h3 className="text-green-700 font-bold text-xl">Protected Home</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Class A metal or tile roof with ember-resistant vents',
                    '5ft gravel/stone buffer around entire foundation',
                    'Metal gutters with mesh guards — cleared seasonally',
                    '1/16" mesh screens on all vents and openings',
                    'Spaced, irrigated low-fuel plants in Zone 1',
                    'Zero dead vegetation within 100ft of the structure',
                    'Go-bags packed, two evacuation routes memorized',
                    'Docs backed up to cloud and out-of-state contact set',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={12} className="text-green-400" />
                      </div>
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL ASSESSMENT CTA */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 p-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.12),transparent_70%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Flame size={13} className="text-white" />
                  <span className="text-white text-xs font-medium">Free Service</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  Is Your Home at Risk?
                </h2>
                <p className="text-orange-100 text-lg max-w-2xl mx-auto mb-8">
                  Get a professional risk assessment from our certified fire defense specialists. We&apos;ll walk your
                  property, identify vulnerabilities, and deliver a personalized defense plan — completely free.
                </p>
                <Link
                  href="/risk-assessment"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-10 py-4 rounded-full transition-all text-base shadow-xl"
                >
                  Schedule Free Risk Assessment <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
