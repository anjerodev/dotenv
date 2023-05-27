import { getSession } from '@/lib/supabase-server'
import MarketingMenu from '@/components/navigation/marketing-menu'
import Navbar from '@/components/navigation/navbar'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { session } = await getSession()

  return (
    <div className="relative">
      <Navbar>
        <MarketingMenu session={session} />
      </Navbar>
      <main className="relative z-10 flex min-h-[100dvh] w-full pt-16">
        {children}
      </main>
    </div>
  )
}
