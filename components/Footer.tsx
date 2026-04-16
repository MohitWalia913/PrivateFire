import Link from 'next/link'
import Image from 'next/image'
import { Flame, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] border-t border-white/10 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Image src="/logo.svg" alt="Private Fire" width={130} height={32} className="mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Private wildfire defense for high-risk homes and properties. Protecting communities, one property at a time.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Fire Map', href: '/map' },
                { label: 'Get Protection', href: '/bid' },
                { label: 'About Us', href: '/#about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Join Our Network', href: '/join-network' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Fire Protection', href: '/bid' },
                { label: 'Defense Plans', href: '/defense-plans' },
                { label: 'Risk Assessment', href: '/risk-assessment' },
                { label: 'Suppression Systems', href: '/suppression-systems' },
                { label: 'Download App', href: '/#download-app' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>   
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Call Us Now</p>
                  <p className="text-white text-sm font-medium">818-414-1980</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">24/7 Support</p>
                  <p className="text-white text-sm font-medium">info@privatefire.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Headquarters</p>
                  <p className="text-white text-sm font-medium">Los Angeles, California, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2026 privatefire.com — All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
