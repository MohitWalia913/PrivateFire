import Link from 'next/link'
import Footer from '@/components/Footer'
import HomeMapSection from '@/components/HomeMapSection'
import { Flame, Shield, Phone, Star, MapPin, Bell, ChevronRight, Download, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

export default function Home() {
  const stats = [
    { value: '331+', label: 'Wildfires in 2025' },
    { value: '57,000+', label: 'Acres Burned' },
    { value: '$2.3B+', label: 'Property Loss' },
    { value: '3,000+', label: 'Homes Protected' },
  ]
  
  const services = [
    {
      icon: <Shield size={28} className="text-orange-400" />,
      title: 'Over 25 Years of Experience',
      desc: 'We deploy firefighter-led protection, equipment staging, and perimeter control to defend your home against live wildfire threats.',
    },
    {
      icon: <Flame size={28} className="text-orange-400" />,
      title: 'Private Firefighting Deployment',
      desc: 'High-risk fire deployment law that works. Our rapid response teams mobilize immediately to protect your property when a fire threatens.',
    },
    {
      icon: <Zap size={28} className="text-orange-400" />,
      title: 'Prevention Plan & Home Hardening',
      desc: 'We inspect your property for vulnerabilities, fuel load, and ignition points, then develop a custom protection strategy.',
    },
  ]

  const features = [
    { icon: <MapPin size={18} />, text: 'Real-time active fire map powered by CAL FIRE data' },
    { icon: <Bell size={18} />, text: 'Emergency alerts within custom radius of your address' },
    { icon: <Shield size={18} />, text: 'Private protection coverage application & scheduling' },
    { icon: <Phone size={18} />, text: 'One-tap emergency call to your assigned team' },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f5] via-[#fff5ec] to-[#f8f7f5]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-orange-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-20 w-64 h-64 bg-orange-300 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Flame size={14} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Protecting People & Properties</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] mb-6">
              We Protect Your Home<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">From Fire</span>{' '}
              When It<br />Matters Most
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
              Prevent loss before it happens — custom protection, real-time monitoring, firefighter-led response. California&apos;s premier private wildfire defense service.
            </p>
            <div className="flex items-center gap-2 mb-8">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f97316" className="text-orange-500" />)}
              </div>
              <span className="text-gray-900 font-bold">4.9/5</span>
              <span className="text-gray-500 text-sm">· 10K reviews</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-orange-400 text-sm">🚒</span>
              <span className="text-gray-700 text-sm font-medium">Real fire trucks · CA-certified crews · 24/7 deployment</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/bid" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full btn-glow transition-all text-base">
                <Shield size={18} /> Request Fire Protection
              </Link>
              <Link href="#download-app" className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold px-8 py-4 rounded-full transition-all text-base shadow-sm">
                <Download size={18} /> Fire Protection App
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['#f97316','#ea580c','#dc2626','#b91c1c'].map((bg, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#f8f7f5] flex items-center justify-center text-white text-xs font-bold" style={{ background: bg }}>
                    {['JD','MK','SR','AL'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-900 text-sm font-semibold">+1,500 satisfied owners</p>
                <p className="text-gray-500 text-xs">across California</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-orange-600 py-3 overflow-hidden">
        <div className="ticker-track flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {['331+ Active wildfires tracked in California', 'Real-time fire protection', '$10K/yr starting coverage', 'Available across California', '24/7 Emergency Response', 'Private firefighters on standby'].map((item, j) => (
                <span key={j} className="inline-flex items-center gap-3 px-8 text-white font-medium text-sm">
                  <Flame size={14} /> {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* HOME MAP */}
      <HomeMapSection />                        

      {/* STATS */}
      <section className="bg-[#e8e3dc] border-y border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 mb-1">{s.value}</p>
                <p className="text-gray-600 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-[#f8f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative border border-gray-200"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589285950979-e26e24cd0f9f?auto=format&fit=crop&w=800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center mx-auto mb-4 fire-pulse">
                      <Flame size={52} className="text-orange-400" />
                    </div>
                    <p className="text-gray-300 text-sm font-medium">Private Fire Protection</p>
                    <p className="text-orange-400 font-bold text-2xl mt-1">Available 24/7</p>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 bg-orange-500 rounded-xl p-4 shadow-xl max-w-[160px]">
                  <Phone size={18} className="text-white mb-1" />
                  <p className="text-white font-bold text-sm">Any Emergency Help</p>
                  <p className="text-orange-100 text-xs mt-0.5">Available 24/7 for emergency support</p>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">About Us</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">
                Because Insurance Doesn&apos;t Cover{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Priceless Memories</span>
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-500 pl-5 py-3 rounded-r-lg mb-6">
                <p className="text-orange-600 font-semibold text-sm">Over 25 Years of Experience</p>
                <p className="text-gray-600 text-sm mt-1">Prevent loss before it happens — custom protection, real-time monitoring, firefighter-led response.</p>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our private firefighters are dedicated to fighting the fires that threaten your home. Private Fire brings military-grade wildfire suppression technology directly to high-value residential properties.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &ldquo;Don&apos;t just insure your home against fire — <strong className="text-orange-600 not-italic">put real firefighters between your family and the flames</strong> before it&apos;s too late.&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {['Dedicated firefighter assigned to your property', 'Fire-hardening assessment included', 'Priority response during active fire events', 'Real-time monitoring of nearby fire threats'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-orange-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/bid" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-full btn-glow transition-all text-sm">
                Learn More <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#f2f0ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Our Services</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Our Fire Protection<br />Services</h2>
            </div>
            <div className="lg:pt-12">
              <p className="text-gray-600 leading-relaxed">We provide private wildfire defense for high-value homes and properties. From prevention to emergency deployment, our trained firefighting teams work to stop fire before it becomes disaster.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Flame size={20} className="text-orange-500" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong className="text-orange-600">State-of-the-Art Equipment</strong> — Real fire trucks built to California Fire Department standards, operated by licensed professionals ready to defend your property.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 card-hover group cursor-pointer shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">{s.icon}</div>
                <h3 className="text-gray-900 font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="rounded-xl h-36 relative overflow-hidden border border-gray-100"
                  style={{ backgroundImage: `url('${[
                    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=75',
                    'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=75',
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=75',
                  ][i]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/55 to-black/25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      {s.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section id="download-app" className="py-24 bg-gradient-to-br from-[#f2f0ed] to-[#fff5ec] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(249,115,22,0.08),transparent_65%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
                <Download size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Get the App</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
                Your Fire Fighters,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Always Ready</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">Sign up for <strong className="text-gray-900">Private Fire</strong> — real-time fire map, emergency alerts, coverage applications, and direct access to your dedicated response team.</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-10">
                {features.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <span className="text-orange-400 flex-shrink-0 mt-0.5">{f.icon}</span>
                    <span className="text-gray-700 text-sm">{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full btn-glow transition-all text-base">
                  <Shield size={18} /> Sign Up Free
                </Link>
                <Link href="/login" className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold px-8 py-4 rounded-full transition-all text-base shadow-sm">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-orange-400/15 blur-3xl rounded-full scale-75" />
                {/* Phone frame */}
                <div className="relative w-[260px] bg-gray-200 rounded-[44px] border-[6px] border-gray-300 shadow-2xl overflow-hidden" style={{ height: '520px' }}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-200 rounded-b-2xl z-10" />
                  {/* Screen content */}
                  <div className="w-full h-full bg-[#f8f7f5] flex flex-col overflow-hidden">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-5 pt-8 pb-2 flex-shrink-0">
                      <span className="text-gray-800 text-xs font-semibold">9:41</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-2 border border-gray-400 rounded-sm"><div className="w-2 h-full bg-gray-500 rounded-sm"/></div>
                      </div>
                    </div>
                    {/* App header */}
                    <div className="px-4 pt-1 pb-3 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                          <Flame size={14} className="text-white" />
                        </div>
                        <span className="text-gray-900 font-black text-sm">Private Fire</span>
                      </div>
                      {/* Alert banner */}
                      <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <div>
                          <p className="text-red-600 text-[10px] font-bold">ACTIVE FIRE ALERT</p>
                          <p className="text-gray-500 text-[9px]">Palisades Fire · 2.1mi away</p>
                        </div>
                      </div>
                    </div>
                    {/* Mini map placeholder */}
                    <div className="mx-4 rounded-xl overflow-hidden flex-shrink-0 border border-orange-100" style={{ height: '130px', background: 'linear-gradient(135deg, #fff5ec 0%, #fef3c7 100%)', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(249,115,22,0.15) 0%, transparent 60%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin size={20} className="text-orange-500 mx-auto mb-1" />
                          <p className="text-orange-600 text-[10px] font-bold">Live Fire Map</p>
                          <p className="text-gray-400 text-[9px]">9 active fires tracked</p>
                        </div>
                      </div>
                      {/* Dots representing fires */}
                      {[[35,45],[55,30],[70,60],[20,65],[80,40]].map(([x,y],di)=>(
                        <div key={di} className="absolute w-2 h-2 rounded-full bg-red-500 border border-orange-300" style={{ left: `${x}%`, top: `${y}%`, boxShadow: '0 0 4px rgba(239,68,68,0.6)' }} />
                      ))}
                    </div>
                    {/* Stats row */}
                    <div className="px-4 py-3 grid grid-cols-3 gap-2 flex-shrink-0">
                      {[['9','Active Fires','text-red-500'],['57K','Acres','text-orange-500'],['24%','Avg Cont.','text-amber-500']].map(([v,l,c])=>(
                        <div key={l} className="bg-white border border-gray-100 rounded-lg p-2 text-center shadow-sm">
                          <p className={`text-sm font-black ${c}`}>{v}</p>
                          <p className="text-gray-400 text-[9px]">{l}</p>
                        </div>
                      ))}
                    </div>
                    {/* Protection status */}
                    <div className="mx-4 bg-orange-50 border border-orange-200 rounded-xl p-3 flex-shrink-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-900 text-[11px] font-bold">My Coverage</p>
                        <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-green-200">ACTIVE</span>
                      </div>
                      <p className="text-gray-500 text-[9px]">123 Oak Ridge Dr, Malibu</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div className="h-1 bg-orange-500 rounded-full w-3/4" />
                      </div>
                      <p className="text-gray-400 text-[9px] mt-1">Coverage status: Active</p>
                    </div>
                    {/* Bottom nav */}
                    <div className="mt-auto border-t border-gray-200 bg-white px-4 py-3 flex justify-around flex-shrink-0">
                      {[['🗺️','Map'],['🔥','Fires'],['🧯','Protect'],['👤','Profile']].map(([ico,lbl])=>(
                        <div key={lbl} className="flex flex-col items-center gap-0.5">
                          <span className="text-base">{ico}</span>
                          <span className="text-gray-400 text-[8px]">{lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Side button details */}
                <div className="absolute -right-1.5 top-20 w-1 h-12 bg-gray-300 rounded-r-full" />
                <div className="absolute -left-1.5 top-16 w-1 h-8 bg-gray-300 rounded-l-full" />
                <div className="absolute -left-1.5 top-28 w-1 h-8 bg-gray-300 rounded-l-full" />
                <div className="absolute -left-1.5 top-40 w-1 h-8 bg-gray-300 rounded-l-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#f8f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
            <Flame size={13} className="text-orange-400" />
            <span className="text-orange-600 text-xs font-medium">How It Works</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-14">Get Protected in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <MapPin size={28} />, title: 'Check Your ZIP', desc: 'Enter your California ZIP code to see if private fire protection is available or join the waitlist.' },
              { step: '02', icon: <Shield size={28} />, title: 'Apply for Coverage', desc: 'Apply for one of 300 annual service slots. Starting at $10K/year with fixed increments. Highest application wins.' },
              { step: '03', icon: <CheckCircle size={28} />, title: 'Stay Protected', desc: 'Your dedicated team monitors threats, conducts assessments, and deploys when fire threatens your property.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-white border border-gray-200 rounded-2xl p-8 card-hover shadow-sm">
                <div className="text-orange-400/20 font-black text-6xl absolute top-4 right-6 select-none">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5 text-orange-400">{item.icon}</div>
                <h3 className="text-gray-900 font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/bid" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full btn-glow transition-all">
              <Flame size={18} /> Apply for Coverage Now
            </Link>
          </div>  
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#f2f0ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
              <Star size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">What Our Clients Say</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900">Trusted by Homeowners<br />Across California</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f97316" className="text-orange-500" />)}
              </div>
              <span className="text-gray-900 font-bold">4.9/5</span>
              <span className="text-gray-500 text-sm">· Based on 10,000+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Michael R.',
                location: 'Malibu, CA',
                initials: 'MR',
                color: '#ea580c',
                quote: 'When the Palisades Fire came within a mile of our home, the Private Fire team was already on-site doing perimeter protection. Our house was one of the few that survived. Worth every penny.',
                stars: 5,
              },
              {
                name: 'Sandra K.',
                location: 'Topanga, CA',
                initials: 'SK',
                color: '#dc2626',
                quote: 'I sleep soundly knowing a dedicated team is monitoring fire threats near my property 24/7. The real-time alerts and emergency line give me peace of mind I never had before.',
                stars: 5,
              },
              {
                name: 'James L.',
                location: 'Thousand Oaks, CA',
                initials: 'JL',
                color: '#b91c1c',
                quote: 'The home assessment they did was incredibly thorough. They identified vulnerabilities I had never considered and helped us harden the property before fire season. Exceptional service.',
                stars: 5,
              },
              {
                name: 'Patricia M.',
                location: 'Calabasas, CA',
                initials: 'PM',
                color: '#f97316',
                quote: 'Our insurance company wouldn&apos;t cover us anymore due to wildfire risk. Private Fire stepped in and gave us the protection we needed. The team responded in under 10 minutes during our last scare.',
                stars: 5,
              },
              {
                name: 'David T.',
                location: 'Agoura Hills, CA',
                initials: 'DT',
                color: '#c2410c',
                quote: 'Professional, responsive, and truly caring about protecting our home and family. Captain Rodriguez and his crew are incredible. I can&apos;t recommend Private Fire enough.',
                stars: 5,
              },
              {
                name: 'Rebecca W.',
                location: 'Santa Barbara, CA',
                initials: 'RW',
                color: '#9a3412',
                quote: 'The live fire map and alert system kept us informed during the Thomas Fire. Knowing exactly where the fire was and that our team was deployed gave us the confidence to make smart decisions.',
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= t.stars ? '#f97316' : 'none'} className={s <= t.stars ? 'text-orange-500' : 'text-gray-300'} />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-bold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section id="contact" className="py-20 bg-[#ede9e4] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
                <Flame size={13} className="text-orange-400" />
                <span className="text-orange-600 text-xs font-medium">Get in Touch</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                Protect Your Home<br />Before It&apos;s Too Late
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Wildfires don&apos;t wait — and neither should you. Our private firefighting teams are on standby to defend high-risk properties and prevent devastating loss.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
              <Link href="/bid" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full btn-glow transition-all">
                <AlertTriangle size={18} /> Get Fire Protection Now
              </Link>
              <Link href="/map" className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold px-8 py-4 rounded-full transition-all shadow-sm">
                <MapPin size={18} /> View Live Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
