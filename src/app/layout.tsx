import 'server-only'
import '@/styles/globals.css'
import { Metadata } from 'next'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import { fontMono, fontSans } from '@/lib/fonts'
import { createServerClient } from '@/lib/supabase-server'
import { SwrProvider } from '@/components/providers/data-fetching-provider'
import SupabaseAuthProvider from '@/components/providers/supabase-auth-provider'
import SupabaseProvider from '@/components/providers/supabase-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'

import MainContainer from './main-container'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontMono.variable)}
    >
      <body className="min-h-[100dvh] bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <ToastProvider>
            <SupabaseProvider>
              <SupabaseAuthProvider serverSession={session}>
                <SwrProvider>
                  <MainContainer session={session}>{children}</MainContainer>
                </SwrProvider>
              </SupabaseAuthProvider>
            </SupabaseProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
