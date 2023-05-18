import { Member, MemberRole } from '@/types/collections'
import { RequestError } from '@/utils/request-error-handler'
import { getSupabaseServerClientInfo } from '@/utils/supabase-server'
import { NextResponse } from 'next/server'

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
    const { data: documentsData, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true })

    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }

    const documents = []

    // Fetch the document data
    for (const document of documentsData) {
      // Get the last document history
      const lastUpdate = supabase
        .from('documents_history')
        .select('updated_at')
        .eq('document_id', document.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      // Get the document members
      const documentTeam = supabase
        .from('documents_members')
        .select('role, member:profiles(id, username, avatar_url)', {
          count: 'exact',
        })
        .eq('document_id', document.id)
        .order('added_at', { ascending: true })
        .limit(3)

      const [lastUpdateData, teamData] = await Promise.all([
        lastUpdate,
        documentTeam,
      ])

      const documentError = lastUpdateData.error || teamData.error

      if (documentError) {
        console.log({ documentError })
        // throw new RequestError({ message: documentError.message })
        continue
      }

      const team: Member[] = []

      if (teamData) {
        for (const member of teamData.data) {
          const { role, member: profile } = member
          if (profile && !Array.isArray(profile)) {
            const avatarUrl = profile.avatar_url
            const avatar = avatarUrl
              ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data
                  .publicUrl
              : null
            const userRole = role as MemberRole

            team.push({ role: userRole, avatar, ...profile })
          }
        }
      }

      documents.push({
        ...document,
        ...lastUpdateData.data,
        team: {
          members: team,
          count: teamData.count,
        },
      })
    }

    return NextResponse.json(documents)
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    })
  }
}
