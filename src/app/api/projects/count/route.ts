import { NextResponse } from 'next/server'

import { RequestError } from '@/lib/request-error-handler'
import { getSupabaseServerClientInfo } from '@/lib/supabase-server'

export type ListProjects = {
  count: number
  projects: string[]
}

export async function GET(request: Request) {
  try {
    const {
      supabase,
      session,
      error: sessionError,
    } = await getSupabaseServerClientInfo()

    if (sessionError || !supabase || !session) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    // Fetch the current user documents and return an array of the related projects id
    const { data: documents, error } = await supabase
      .from('documents_members')
      .select('project_id')
      .eq('user_id', session.user.id)
      .order('project_id', { ascending: true })

    const projects = documents
      ? documents.reduce((prev: string[], curr) => {
          return prev.includes(curr.project_id)
            ? prev
            : [...prev, curr.project_id]
        }, [])
      : []

    if (error) {
      throw new RequestError({ message: error.message, status: 500 })
    }

    const data: ListProjects = { count: projects.length, projects }

    return NextResponse.json(data)
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    })
  }
}
