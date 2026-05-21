'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminSignOutButton() {
  const router = useRouter()

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/administrator/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}
