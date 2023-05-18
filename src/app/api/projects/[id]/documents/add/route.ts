import { NextResponse } from 'next/server'

import { MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSupabaseServerClientInfo } from '@/lib/supabase-server'

type ParamsType = {
  params: { id: string }
}

export async function POST(req: Request, { params }: ParamsType) {
  try {
    const project_id = params.id
    const body = await req.json()

    if (!body || !project_id)
      throw new RequestError({ message: 'No values has been passed.' })
    const { name, content } = body

    const {
      supabase,
      session,
      error: sessionError,
    } = await getSupabaseServerClientInfo()

    if (sessionError || !supabase || !session?.user) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

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

    const { data: document, error } = await supabase
      .from('documents')
      .insert({ name, project_id })
      .select()
      .single()

    if (error) {
      console.log({ error })
      throw new Error('Error creating the new document.')
    }

    const historyPromise = supabase
      .from('documents_history')
      .insert({
        document_id: document.id,
        content,
        updated_by: session.user.id,
      })
      .select()
      .single()

    const memberPromise = supabase
      .from('documents_members')
      .insert({
        document_id: document.id,
        role: MemberRole.Owner,
        user_id: session.user.id,
        project_id,
      })
      .select('*, profile:profiles(id, username, avatar_url)')
      .single()

    const [history, member] = await Promise.all([historyPromise, memberPromise])

    const creationError = history.error || member.error

    const memberData =
      member?.data && !Array.isArray(member.data?.profile)
        ? member.data.profile
        : null

    const avatarUrl = memberData?.avatar_url
    const avatar = avatarUrl
      ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl
      : null

    const team = [{ role: MemberRole.Owner, avatar, ...memberData }]

    if (creationError) {
      console.log({ creationError })
      throw new RequestError({
        message: 'Error creating the new document.',
      })
    }

    const data = { ...document, ...history.data, team }
    return NextResponse.json(data)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
