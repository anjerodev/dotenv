import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { getAuthUser } from '@/lib/supabase-server'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getAuthUser()

  if (!user?.username) redirect(routes.ACCOUNT)

  return <div className="mx-auto w-full max-w-4xl px-8 py-12">{children}</div>
}
