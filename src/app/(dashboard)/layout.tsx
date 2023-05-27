import { getSession } from '@/lib/supabase-server'
import Navbar from '@/components/navigation/navbar'
import UserMenu from '@/components/navigation/user-menu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = await getSession()

  return (
    <div className="relative">
      <Navbar>
        <UserMenu user={user!} />
      </Navbar>
      <main className="relative z-10 flex min-h-[100dvh] w-full pt-16">
        {children}
      </main>
    </div>
  )
}
