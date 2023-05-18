import { NextResponse } from 'next/server'

import { RequestError } from '@/lib/request-error-handler'
import { getSupabaseServerClientInfo } from '@/lib/supabase-server'

type ParamsType = {
  params: { id: string }
}

export async function GET(request: Request, { params }: ParamsType) {
  const project_id = params.id

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

    // Fetch the project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .limit(1)
      .single()

    if (error) {
      throw new RequestError({ message: error.message })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    })
  }
}
