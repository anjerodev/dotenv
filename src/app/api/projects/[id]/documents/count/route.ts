import { NextResponse } from 'next/server'

import { RequestError } from '@/lib/request-error-handler'
import { getSupabaseServerClientInfo } from '@/lib/supabase-server'

type ParamsType = {
  params: { id: string }
}

// Count the document for preloading
export async function GET(request: Request, { params }: ParamsType) {
  const id = params.id

  try {
    const { supabase, error: sessionError } =
      await getSupabaseServerClientInfo()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { count, error } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', id)

    if (error) {
      throw new RequestError({ message: error.message })
    }

    return NextResponse.json({ count })
  } catch (error: any) {
    return new Response(error.message, { status: error.status })
  }
}
