import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { getAuthUser } from '@/lib/supabase-server'

interface ProjectsLayoutProps {
  children: React.ReactNode
}

export default async function ProjectsLayout({
  children,
}: ProjectsLayoutProps) {
  const user = await getAuthUser()

  if (!user?.username) redirect(routes.ACCOUNT)

  return <section className='w-full'>{children}</section>
}
