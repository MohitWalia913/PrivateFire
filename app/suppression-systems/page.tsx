import Link from 'next/link'
import {
  Flame,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Droplets,
  Home,
  Leaf,
  Wind,
  Info,
} from 'lucide-react'
import Footer from '@/components/Footer'

const systems = [
  {
    id: 'sprinkler',
    icon: <Droplets size={28} className="text-orange-400" />,
    title: 'Residential Sprinkler Systems',
    description:
      'The most widely installed suppression system in residential construction. Sprinkler heads activate automatically when a fusible link or glass bulb within the head reaches 135–165°F — the threshold indicating fire in the immediate area.',
    howItWorks:
      'Each sprinkler head is individually heat-activated. When triggered, water flows through the piping network and is dispersed in a circular pattern covering 130–210 square feet. Modern systems are integrated with the home\'s domestic plumbing supply, requiring no separate water tank.',
    pros: [
      'Automatic activation — no human action required',
      'Stops most fires before they spread beyond the room of origin',
      'Can reduce homeowner insurance premiums by 5–15%',
      'Required by code in all new California residential construction since 2011',
    ],
    cons: [
      'Requires dedicated water supply and adequate pressure',
      'Minimal protection against exterior ember intrusion',
      'Water damage is a secondary concern if activated accidentally',
      'Not designed specifically for wildfire — better for interior fires',
    ],
    layout: 'text-left',
  },
  {
    id: 'foam',
    icon: <Shield size={28} className="text-orange-400" />,
    title: 'Exterior Foam & Suppressant Systems',
    description:
      'Class A foam systems coat exterior surfaces with a fire-retardant foam blanket before or during a fire event. These are deployed by professional crews — including Private Fire teams — who apply foam to roofs, walls, decks, and vegetation in advance of a fire front.',
    howItWorks:
      'A foam concentrate is mixed with water at a 0.2–1.0% concentration and discharged through specialized nozzles. The foam adheres to surfaces, insulating them from heat and blocking oxygen. A single application can provide 2–4 hours of protection against radiant heat and ember showers.',
    pros: [
      'Dramatically reduces exterior ignition from embers',
      'Can be applied pre-emptively before fire arrives',
      'Effective on all exterior surface types',
      'Biodegradable — washes away with rain',
    ],
    cons: [
      'Must be applied by trained professionals',
      'Requires specialized equipment and foam concentrate',
      'Protection is temporary — degrades in heat and wind',
      'Not suitable as a permanent installed system',
    ],
    layout: 'text-right',
  },
  {
    id: 'misting',
    icon: <Wind size={28} className="text-orange-400" />,
    title: 'Water Misting Systems',
    description:
      'High-pressure water misting systems generate ultra-fine water droplets (less than 100 microns in diameter) that are dramatically more effective at cooling and suppressing fire than conventional sprinkler systems — while using significantly less water.',
    howItWorks:
      'A high-pressure pump (typically 100–300 bar) forces water through micro-orifice nozzles, creating a dense fog of fine droplets. The large surface area of fine mist allows it to absorb heat 6–10x more efficiently than coarser water sprays. This cools the air, displaces oxygen, and suppresses combustion simultaneously.',
    pros: [
      '60–70% less water consumption than traditional sprinklers',
      'More effective at cooling and smoke suppression',
      'Can cover larger areas with less infrastructure',
      'Works in areas with limited water supply',
    ],
    cons: [
      'Higher installation cost than conventional sprinklers',
      'Nozzles can clog — require regular maintenance',
      'Less effective in high-wind conditions (droplets disperse)',
      'Limited effectiveness against fully developed fires',
    ],
    layout: 'text-left',
  },
  {
    id: 'irrigation',
    icon: <Leaf size={28} className="text-orange-400" />,
    title: 'Underground & Drip Irrigation Defense',
    description:
      'Converting or extending your existing landscaping irrigation system into a fire defense perimeter is the most cost-effective suppression strategy available. A wet zone around your property\'s perimeter acts as a firebreak and dramatically reduces fuel combustibility.',
    howItWorks:
      'Existing drip or sprinkler irrigation zones are reconfigured to maintain high soil and plant moisture within Zone 1 (0–30ft) around the structure. Pop-up sprinkler heads can be added along the roofline and eaves. Automated controllers tied to weather data ensure the system runs before fire weather events.',
    pros: [
      'Lowest cost of any suppression approach',
      'Uses existing infrastructure in most cases',
      'Provides continuous passive protection',
      'Combines fire defense with landscape maintenance',
    ],
    cons: [
      'Not effective during active fire events — water supply can fail',
      'Requires reliable, pressurized water source',
      'Must be maintained year-round — not set-and-forget',
      'Low effectiveness against ember showers on roof and upper structure',
    ],
    layout: 'text-right',
  },
]

const comparisonRows = [
  {
    label: 'Typical Cost',
    values: ['$1.50–$3.50/sqft', '$2,000–$8,000/application', '$3–$7/sqft', '$500–$5,000'],
  },
  {
    label: 'DIY Possible',
    values: [false, false, false, true],
  },
  {
    label: 'Coverage Area',
    values: ['Interior', 'Exterior', 'Interior & Exterior', 'Perimeter'],
  },
  {
    label: 'Maintenance',
    values: ['Annual inspection', 'Professional application', 'Quarterly nozzle check', 'Monthly system check'],
  },
  {
    label: 'Wildfire Effectiveness',
    values: ['medium', 'high', 'medium', 'low'],
  },
]

function EffectivenessBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    high: 'bg-green-50 border border-green-200 text-green-700',
    medium: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
    low: 'bg-red-50 border border-red-200 text-red-700',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${map[level] ?? ''}`}>
      {level}
    </span>
  )
}

const faqItems = [
  {
    q: 'When should I install a suppression system?',
    a: 'Before fire season — ideally in winter or early spring. Installation takes 1–4 weeks depending on system type, and permits must be obtained in advance. Never wait until a fire is threatening your area.',
  },
  {
    q: 'What do suppression systems cost?',
    a: 'Residential sprinklers run $1.50–$3.50 per square foot during new construction, or $2–$7 per square foot for retrofits. Misting systems cost slightly more. Irrigation-based perimeter defense can be implemented for under $5,000 on most properties.',
  },
  {
    q: 'Do suppression systems reduce insurance premiums?',
    a: 'In many cases, yes. NFPA-compliant residential sprinkler systems can reduce homeowner insurance premiums by 5–15%. Some insurers also offer discounts for documented defensible space and exterior foam treatment programs.',
  },
  {
    q: 'What maintenance do these systems require?',
    a: 'Annual inspections are required for sprinkler and misting systems. Irrigation-based systems need seasonal checks. Foam systems are applied by professionals as needed — they are not permanent installations requiring ongoing maintenance.',
  },
  {
    q: 'Can I combine systems?',
    a: 'Yes — and this is the recommended approach for high-risk properties. A layered strategy combining interior sprinklers, perimeter irrigation defense, and scheduled professional foam application provides the highest level of protection.',
  },
]

export default function SuppressionSystemsPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-0">

        {/* HERO */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f5] via-[#fff5ec] to-[#f8f7f5]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Info size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Educational Guide</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-[1.08] mb-6 max-w-4xl mx-auto">
              Fire Suppression Systems:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                A Complete Guide
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              Understanding your suppression options is the first step in comprehensive fire protection. Private Fire
              does not install suppression systems, but we help you understand your risk and defense strategy.
            </p>
          </div>
        </section>

        {/* SYSTEM TYPES — alternating layout */}
        <section className="py-20 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">System Types</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">The Four Major Suppression Systems</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Each system type has different applications, costs, and effectiveness against wildfire. Understanding
                all four helps you build the right layered defense.
              </p>
            </div>

            <div className="space-y-16">
              {systems.map((system, idx) => (
                <div
                  key={system.id}
                  className={`grid lg:grid-cols-2 gap-12 items-start ${idx % 2 === 1 ? 'lg:flex lg:flex-row-reverse' : ''}`}
                >
                  {/* Text side */}
                  <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-200 flex items-center justify-center mb-5">
                      {system.icon}
                    </div>
                    <h3 className="text-gray-900 font-black text-2xl mb-4">{system.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-5">{system.description}</p>
                    <div className="bg-orange-50 border-l-4 border-orange-500 pl-5 py-3 rounded-r-lg mb-6">
                      <p className="text-orange-600 font-semibold text-sm mb-1">How It Works</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{system.howItWorks}</p>
                    </div>
                  </div>

                  {/* Pros / Cons side */}
                  <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-green-700 font-bold text-sm mb-4 flex items-center gap-2">
                        <CheckCircle size={14} /> Advantages
                      </h4>
                      <ul className="space-y-3">
                        {system.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle size={9} className="text-green-400" />
                            </div>
                            <span className="text-gray-700 text-sm">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-red-700 font-bold text-sm mb-4 flex items-center gap-2">
                        <AlertTriangle size={14} /> Limitations
                      </h4>
                      <ul className="space-y-3">
                        {system.cons.map((con) => (
                          <li key={con} className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-red-400 text-[9px] font-bold">✕</span>
                            </div>
                            <span className="text-gray-600 text-sm">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Side-by-Side</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">System Comparison</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Compare the four systems across cost, installation, coverage, and wildfire effectiveness.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Header row */}
              <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
                <div className="p-4 text-gray-500 text-xs font-bold uppercase tracking-wider">Criteria</div>
                {['Sprinklers', 'Foam Systems', 'Water Misting', 'Irrigation Defense'].map((h) => (
                  <div key={h} className="p-4 text-orange-600 text-xs font-bold text-center border-l border-gray-100">{h}</div>
                ))}
              </div>
              {/* Data rows */}
              {comparisonRows.map((row, ri) => (
                <div key={row.label} className={`grid grid-cols-5 border-t border-gray-100 ${ri % 2 === 0 ? '' : 'bg-gray-50'}`}>
                  <div className="p-4 text-gray-600 text-sm font-medium">{row.label}</div>
                  {row.values.map((val, vi) => (
                    <div key={vi} className="p-4 text-center border-l border-gray-100 flex items-center justify-center">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <CheckCircle size={16} className="text-green-400" />
                        ) : (
                          <span className="text-red-400 font-bold text-sm">✕</span>
                        )
                      ) : typeof val === 'string' && ['high', 'medium', 'low'].includes(val) ? (
                        <EffectivenessBadge level={val} />
                      ) : (
                        <span className="text-gray-700 text-xs">{val as string}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIAGRAM SECTION — How Sprinklers Work */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Droplets size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Technical Diagram</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">How Sprinkler Systems Work</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                A cross-section view of how heat-activated sprinkler heads protect a residential structure.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden shadow-sm">
              {/* Diagram wrapper */}
              <div className="relative mx-auto" style={{ maxWidth: 800, height: 420 }}>

                {/* Sky / ceiling */}
                <div className="absolute top-0 left-0 right-0 h-16 rounded-t-xl" style={{ background: 'linear-gradient(to bottom, rgba(249,115,22,0.06), transparent)' }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2">
                    <span className="text-orange-400 text-xs font-bold bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">Heat Detection Zone · 135–165°F Activation</span>
                  </div>
                </div>

                {/* Ceiling line */}
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-300" />

                {/* Main pipe (horizontal) */}
                <div className="absolute h-3 bg-gradient-to-r from-blue-500/60 to-blue-400/60 rounded-full border border-blue-400/30"
                  style={{ top: 18, left: '5%', right: '5%' }}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-blue-300 text-[10px] font-bold whitespace-nowrap">Water Supply Main</div>
                </div>

                {/* Sprinkler head 1 */}
                <div className="absolute flex flex-col items-center" style={{ top: 21, left: '20%' }}>
                  <div className="w-2 h-6 bg-blue-400/60 border border-blue-400/30 rounded-b-sm" />
                  <div className="w-5 h-2 bg-orange-400/80 rounded-full border border-orange-400/50 -mt-0.5" />
                  {/* Water spray lines */}
                  <div className="relative mt-1" style={{ width: 80, height: 60 }}>
                    {[-35, -20, -5, 5, 20, 35].map((angle, i) => (
                      <div key={i} className="absolute top-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-400/80 to-blue-400/10 rounded-full"
                        style={{ height: 50, transformOrigin: 'top center', transform: `translateX(-50%) rotate(${angle}deg)` }} />
                    ))}
                  </div>
                  <span className="text-blue-300 text-[9px] font-bold mt-1 whitespace-nowrap">Head 1 · Active</span>
                </div>

                {/* Sprinkler head 2 */}
                <div className="absolute flex flex-col items-center" style={{ top: 21, left: '50%', transform: 'translateX(-50%)' }}>
                  <div className="w-2 h-6 bg-blue-400/60 border border-blue-400/30 rounded-b-sm" />
                  <div className="w-5 h-2 bg-orange-400/80 rounded-full border border-orange-400/50 -mt-0.5" />
                  <div className="relative mt-1" style={{ width: 80, height: 60 }}>
                    {[-35, -20, -5, 5, 20, 35].map((angle, i) => (
                      <div key={i} className="absolute top-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-400/80 to-blue-400/10 rounded-full"
                        style={{ height: 50, transformOrigin: 'top center', transform: `translateX(-50%) rotate(${angle}deg)` }} />
                    ))}
                  </div>
                  <span className="text-blue-300 text-[9px] font-bold mt-1 whitespace-nowrap">Head 2 · Active</span>
                </div>

                {/* Sprinkler head 3 — inactive (glass bulb intact) */}
                <div className="absolute flex flex-col items-center" style={{ top: 21, right: '18%' }}>
                  <div className="w-2 h-6 bg-gray-500/40 border border-gray-500/20 rounded-b-sm" />
                  <div className="w-5 h-2 bg-gray-500/40 rounded-full border border-gray-500/20 -mt-0.5" />
                  <div className="h-12 flex items-center">
                    <span className="text-gray-500 text-[9px]">|</span>
                  </div>
                  <span className="text-gray-500 text-[9px] font-bold whitespace-nowrap">Head 3 · Standby</span>
                </div>

                {/* Floor */}
                <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-xl border-t border-gray-300"
                  style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.04), transparent)' }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-500 text-[10px] font-bold whitespace-nowrap">Floor Level</div>
                </div>

                {/* Heat source (fire) */}
                <div className="absolute" style={{ bottom: 48, left: '38%' }}>
                  <div className="flex flex-col items-center">
                    <div className="text-orange-400 text-2xl" style={{ textShadow: '0 0 20px rgba(249,115,22,0.8)' }}>🔥</div>
                    <span className="text-orange-300 text-[9px] font-bold">Heat Source</span>
                    {/* Heat rise lines */}
                    <div className="absolute -top-10 flex gap-1 justify-center w-20 -translate-x-2">
                      {[0,1,2,3].map((i) => (
                        <div key={i} className="w-0.5 bg-gradient-to-t from-orange-500/60 to-transparent rounded-full" style={{ height: 40 + i * 8 }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Water supply label */}
                <div className="absolute bottom-10 left-4 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-blue-300 text-[10px] font-bold">Water Supply</span>
                </div>

                {/* Coverage arc label */}
                <div className="absolute" style={{ top: 100, left: '10%' }}>
                  <div className="w-32 h-10 border-b border-dashed border-blue-400/30 rounded-b-full" />
                  <span className="text-blue-400 text-[9px] font-bold block text-center mt-1">130–210 sqft coverage per head</span>
                </div>

              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200 justify-center">
                {[
                  { color: 'bg-blue-400', label: 'Water piping' },
                  { color: 'bg-orange-400', label: 'Sprinkler head (activated)' },
                  { color: 'bg-gray-500', label: 'Sprinkler head (standby)' },
                  { color: 'bg-orange-500', label: 'Heat / fire source' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color} opacity-80`} />
                    <span className="text-gray-600 text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / KEY CONSIDERATIONS */}
        <section className="py-24 bg-[#f8f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Key Considerations</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Common Questions</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                The most important things homeowners ask before deciding on a suppression strategy.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-500 text-xs font-black">Q</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-base mb-3">{item.q}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISCLAIMER BOX */}
        <section className="pb-12 bg-[#f8f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-700 font-bold text-sm mb-2">Important Disclaimer</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Private Fire does not install or maintain suppression systems of any kind. We recommend
                  consulting a licensed fire protection engineer for installation guidance. However, our free
                  Risk Assessment can help determine which suppression systems are best suited for your property
                  and risk profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-24 bg-[#f2f0ed]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 p-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.12),transparent_70%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Flame size={13} className="text-white" />
                  <span className="text-white text-xs font-medium">Free Service</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  Ready for a Professional Risk Assessment?
                </h2>
                <p className="text-orange-100 text-lg max-w-2xl mx-auto mb-8">
                  Understanding suppression systems is step one. Step two is knowing exactly what your property
                  needs. Our certified specialists walk your property and deliver a personalized defense plan —
                  completely free.
                </p>
                <Link
                  href="/risk-assessment"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-10 py-4 rounded-full transition-all text-base shadow-xl"
                >
                  Get My Free Assessment <ArrowRight size={18} />
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
