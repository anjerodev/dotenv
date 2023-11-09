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
    await supabase
      .from('logs')
      .select('*')
      .limit(10)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized', ok: false },
      { status: 500 }
    )
  }
}
