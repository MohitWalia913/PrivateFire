'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Flame } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ✅ hooks ke baad condition (important fix)
  if (pathname.startsWith('/signup') || pathname.startsWith('/login')) {
    return null
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/map', label: 'Fire Map' },
    { href: '/join-network', label: 'Join Network' },
    { href: '/#about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">
              PRIVATE <span className="text-orange-500">FIRE</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-700 hover:text-orange-500 font-medium"
                >
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-orange-500 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 p-2"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-gray-200 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-orange-500 font-medium"
            >
              {l.label}
            </Link>
          ))}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-orange-500 text-left"
            >
              Sign Out ({session.user?.name})
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-orange-500"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="bg-orange-500 text-white font-semibold text-center px-4 py-2 rounded-full"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}