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
      <main className="relative z-10 mx-auto flex w-full max-w-4xl px-6 pb-16 pt-24 lg:px-0">
        {children}
      </main>
    </div>
  )
}
