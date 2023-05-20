import { NextRequest, NextResponse } from 'next/server'

import { Member, MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSession, supabase } from '@/lib/supabase-server'

type ParamsType = {
  params: { doc: string; id: string }
}

// do not cache this page
export const revalidate = 0

export async function GET(req: NextRequest, { params }: ParamsType) {
  const documentId = params.doc

  try {
    const { error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const documentPromise = supabase
      .from('documents_history')
      .select(
        'id, document_id,updated_at, document:documents(*), updated_by:profiles(id, username, avatar_url)'
      )
      .eq('document_id', documentId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    // Get the document members
    const teamPromise = supabase
      .from('documents_members')
      .select('role, member:profiles(id, username, avatar_url)', {
        count: 'exact',
      })
      .eq('document_id', documentId)
      .order('added_at', { ascending: true })

    const [document, team] = await Promise.all([documentPromise, teamPromise])

    const error = document.error || team.error
    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }

    const { data: decrypted } = await supabase
      .from('decrypted_documents_history')
      .select('decrypted_content')
      .eq('id', document.data.id)
      .limit(1)
      .single()

    const members: Member[] = []

    if (team) {
      for (const member of team.data) {
        const { role, member: profile } = member
        if (profile && !Array.isArray(profile)) {
          const avatarUrl = profile.avatar_url
          const avatar = avatarUrl
            ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data
                .publicUrl
            : null
          const userRole = role as MemberRole

          members.push({ role: userRole, avatar, ...profile })
        }
      }
    }

    const documentData = Array.isArray(document.data.document)
      ? document.data.document[0]
      : document.data.document

    return NextResponse.json({
      ...document.data,
      ...documentData,
      content: decrypted?.decrypted_content,
      team: { members, count: team.count },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function PATCH(req: Request, { params }: ParamsType) {
  const documentId = params.doc
  const project_id = params.id
  const body = await req.json()

  try {
    if (!body || !project_id)
      throw new RequestError({ message: 'No values has been passed.' })
    const { name, content } = body

    const { session, error: sessionError } = await getSession()

    if (sessionError || !session?.user) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    if (name) {
      // Check that there is not a document with the same name in the project
      const { data: prevDoc } = await supabase
        .from('documents')
        .select('id')
        .eq('name', name)
        .limit(1)
        .single()

      if (prevDoc) {
        throw new RequestError({
          message: 'Validation fail.',
          form: {
            name: 'The document already exist, please, use another name.',
          },
        })
      }

      const { error } = await supabase
        .from('documents')
        .update({ name })
        .eq('id', documentId)

      if (error) {
        throw new RequestError({
          message: 'The document name could not be updated.',
        })
      }
    }

    const { data: newHistory, error } = await supabase
      .from('documents_history')
      .insert({
        document_id: documentId,
        content,
        updated_by: session.user.id,
      })
      .select('*, updated_by:profiles(id, username, avatar_url)')
      .single()

    // const { data: newHistoryContent } = await supabase
    //   .from('decrypted_documents_history')
    //   .select('decrypted_content')
    //   .eq('id', newHistory?.id)
    //   .single()

    // console.log({ newHistory, newHistoryContent })

    if (error) {
      console.log({ error })
      throw new RequestError({ message: 'Error creating the new document.' })
    }

    const data: any = {
      ...newHistory,
      content: '',
      // content: newHistoryContent?.decrypted_content,
    }
    if (name) data.name = name

    return NextResponse.json(data)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
