'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { routes } from '@/constants/routes'
import { Session } from '@supabase/supabase-js'

import Navbar from '@/components/navigation/navbar'

export default function MainContainer({
  session,
  children,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const path = usePathname()

  const hasNavbar = ![routes.LOGIN].includes(path)

  return (
    <div className="relative">
      {hasNavbar && (
        <div className="fixed left-0 top-0 z-20 block w-full">
          <Navbar session={session} />
        </div>
      )}
      <main
        className={`relative z-10 min-h-screen w-full ${
          hasNavbar ? 'pt-16' : 'pt-0'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
