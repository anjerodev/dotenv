import { NextResponse, type NextRequest } from 'next/server'
import { routes } from '@/constants/routes'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient<Database>({
    req,
    res,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const url = new URL(req.url)
    url.pathname = routes.LOGIN
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/account', '/projects'],
}

// export const config = {
//   matcher: '/middleware-protected/:path*',
// }
