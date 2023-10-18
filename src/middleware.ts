import { NextResponse, type NextRequest } from 'next/server'
import { routes } from '@/constants/routes'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/types/supabase'

const whiteList = ['/api/auth/callback', '/api/cron']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const { pathname } = url
  const referer = req.headers.get('referer')

  if (pathname.startsWith(`/api/`) && !whiteList.includes(pathname)) {
    const appUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3081'
        : (process.env.APP_URL as string)
    if (!referer?.includes(appUrl)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }

  const isAuthPage = pathname.startsWith(routes.LOGIN)

  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL(routes.PROJECTS, req.url))
    }

    return null
  }

  if (!session) {
    let from = pathname
    if (url.search) {
      from += url.search
    }

    return NextResponse.redirect(
      new URL(`${routes.LOGIN}?from=${encodeURIComponent(from)}`, req.url)
    )
  }

  return res
}

export const config = {
  matcher: ['/account', '/projects/:path*', '/login', '/api/:path*'],
}
