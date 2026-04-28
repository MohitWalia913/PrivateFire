'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Flame, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

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
    pathname.startsWith('/reset-password')
  ) {
    return null
  }

  const useMinimalTopbar =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/map'

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/map', label: 'Fire Map' },
    { href: '/join-network', label: 'Join Network' },
    { href: '/#about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]

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
            <a
              href="https://privatefire.com"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
            >
              Back to site
            </a>
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