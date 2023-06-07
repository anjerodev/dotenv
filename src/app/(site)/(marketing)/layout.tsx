import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { getAuthUser } from '@/lib/supabase-server'
import MarketingMenu from '@/components/navigation/marketing-menu'
import Navbar from '@/components/navigation/navbar'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getAuthUser()

  if (user) redirect(routes.PROJECTS)

  return (
    <div id="marketing-layout" className="relative">
      <Navbar>
        <MarketingMenu />
      </Navbar>
      <main className="relative z-10 flex min-h-[100dvh] w-full pt-16">
        {children}
      </main>
    </div>
  )
}
