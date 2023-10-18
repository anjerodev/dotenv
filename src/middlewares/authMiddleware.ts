import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
  } from 'next/server'
  import { routes } from '@/constants/routes'
  import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
  
  import type { Database } from '@/types/supabase'
  
  const PRIVATE_ROUTES = ['/account', '/projects', '/login']

  export function authMiddleware(middleware: NextMiddleware) {
    return async (req: NextRequest, event: NextFetchEvent) => {
        const url = req.nextUrl
        const {pathname} = url
        const res = NextResponse.next()


      const matcher = [...PRIVATE_ROUTES]
  
      const dependOnSession = matcher.some((path) =>
      pathname.startsWith(path)
      )
  
      if (!dependOnSession) return middleware(req, event)
  
      const supabase = createMiddlewareClient<Database>({ req, res })
      const {
        data: { session },
      } = await supabase.auth.getSession()
  
      const isAuthPage = pathname.startsWith(routes.LOGIN)
  
      if (!session && !isAuthPage) {
        let from = pathname
        if (url.search) {
          from += url.search
        }
  
        return NextResponse.redirect(
          new URL(
            `${routes.LOGIN}?from=${encodeURIComponent(from)}`,
            req.url
          )
        )
      }
  
      if (session) {
        if (isAuthPage) {
          return NextResponse.redirect(
            new URL(routes.PROJECTS, req.url)
          )
        }
      }
  
      return middleware(req, event)
    }
  }
  