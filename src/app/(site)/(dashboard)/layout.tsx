import { getAuthUser } from '@/lib/supabase-server'
import Navbar from '@/components/navigation/navbar'
import UserMenu from '@/components/navigation/user-menu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getAuthUser()

  return (
    <div id="dashboard-layout" className="relative">
      <Navbar>
        <UserMenu user={user!} />
      </Navbar>
      <main className="relative z-10 flex min-h-[100dvh] w-full max-w-4xl mx-auto pb-16 pt-24">
        {children}
      </main>
    </div>
  )
}
