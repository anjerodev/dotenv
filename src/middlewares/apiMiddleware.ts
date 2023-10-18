import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
  } from 'next/server'
  
  const whiteList = ['/api/auth/callback', '/api/cron']
  
  export function apiMiddleware(middleware: NextMiddleware) {
    return async (req: NextRequest, event: NextFetchEvent) => {
      const url = req.nextUrl
      const { pathname } = url
      const referer = req.headers.get('referer')
  
      if (pathname.startsWith('/api/') && !whiteList.includes(pathname)) {
        const appUrl =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3081'
            : (process.env.APP_URL as string)
        if (!referer?.includes(appUrl)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
      }
  
      return middleware(req, event)
    }
  }
  