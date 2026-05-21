'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Flame, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/** Public marketing site (app subdomain returns here). Override with NEXT_PUBLIC_MARKETING_SITE_URL. */
const MARKETING_HOME_URL =
  (typeof process.env.NEXT_PUBLIC_MARKETING_SITE_URL === 'string'
    ? process.env.NEXT_PUBLIC_MARKETING_SITE_URL.trim()
    : '') || 'https://privatefire.com'

const MAP_HEADER_LINKS = [
  { href: 'https://www.privatefire.com/', label: 'Home' },
  { href: 'https://app.privatefire.com/map', label: 'Fire Map' },
  { href: 'https://www.privatefire.com/join-network', label: 'Join Network' },
  { href: 'https://www.privatefire.com/#about-us', label: 'About Us' },
  { href: 'https://www.privatefire.com/contact-us', label: 'Contact' },
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    
    // Check auth status
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        console.error('Auth check error:', err)
      }
    }
    checkAuth()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ✅ hooks ke baad condition (important fix)
  if (
    pathname.startsWith('/signup') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/embed') ||
    pathname.startsWith('/administrator')
  ) {
    return null
  }

  const useMinimalTopbar =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/')

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/map', label: 'Fire Map' },
    { href: '/join-network', label: 'Join Network' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]

  if (pathname === '/map') {
    return (
      <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="announcment-bar-bg bg-orange-500 px-2 py-4">
          <p className="announcment-bar-text text-center font-['Montserrat',sans-serif] text-[0.8rem] font-medium leading-none text-white">
            We deploy dedicated fire crews during wildfires
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href={MARKETING_HOME_URL} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Flame size={18} className="text-white" />
              </div>
              <span className="font-black text-gray-900 text-lg tracking-tight">
                PRIVATE <span className="text-orange-500">FIRE</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-7">
              {MAP_HEADER_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    link.href === 'https://app.privatefire.com/map'
                      ? 'text-orange-500'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm text-gray-700 hover:text-orange-500 font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-gray-700 hover:text-orange-500 font-medium">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700 p-2">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
            {MAP_HEADER_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-medium ${
                  link.href === 'https://app.privatefire.com/map'
                    ? 'text-orange-500'
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                {link.label}
              </a>
            ))}

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-700 hover:text-orange-500 font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setOpen(false)
                  }}
                  className="text-left text-gray-700 hover:text-orange-500 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-gray-700 hover:text-orange-500 font-medium">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="text-orange-500 hover:text-orange-400 font-semibold">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    )
  }

  if (useMinimalTopbar) {
    return (
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Flame size={18} className="text-white" />
              </div>
              <span className="font-black text-gray-900 text-lg tracking-tight">
                PRIVATE <span className="text-orange-500">FIRE</span>
              </span>
            </Link>
            <Link
              href={MARKETING_HOME_URL}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </nav>
    )
  }

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
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-700 hover:text-orange-500 font-medium"
                >
                  {user.user_metadata?.first_name || user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                  <LogOut size={14} /> Sign Out
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

          {user ? (
            <button
              onClick={() => {
                handleLogout()
                setOpen(false)
              }}
              className="text-left text-gray-700 hover:text-orange-500 font-medium"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-gray-700 hover:text-orange-500 font-medium">
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="text-orange-500 hover:text-orange-400 font-semibold">
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}