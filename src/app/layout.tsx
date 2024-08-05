import '@/styles/globals.css'

import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import { siteConfig } from '@/config/site'
import { fontMono, fontSans } from '@/lib/fonts'
import { createServerClient } from '@/lib/supabase-server'
import { cn } from '@/lib/utils'
import { SwrProvider } from '@/components/providers/data-fetching-provider'
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { ToastProvider } from '@/components/providers/toast-provider'

export const metadata: Metadata = {
  title: {
    template: `%s - ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontSans.variable,
        fontMono.variable,
        'selection:bg-primary selection:text-primary-foreground'
      )}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <ToastProvider>
          <SupabaseProvider>
            <SupabaseAuthProvider serverSession={session}>
              <SwrProvider>{children}</SwrProvider>
            </SupabaseAuthProvider>
          </SupabaseProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
