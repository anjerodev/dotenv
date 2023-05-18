import { checkUsername } from '@/lib/supabase-server'

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkUsername()
  return <>{children}</>
}
