import { NextRequest, NextResponse } from 'next/server'

import { createRouterHandleClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error('Unauthorized')
    }
    const supabase = createRouterHandleClient()
    const { error } = await supabase.from('logs').insert({})

    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
