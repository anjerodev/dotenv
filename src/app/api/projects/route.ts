import { NextResponse } from 'next/server'

import { Member, MemberRole, Project } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSupabaseServerClientInfo } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const projects = body?.projectsIds ?? []
    const data: Project[] = []
    const { supabase, error: sessionError } =
      await getSupabaseServerClientInfo()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    for (const projectId of projects) {
      // Fetch the document project info
      const { data: project } = await supabase
        .from('projects')
        .select('*, documents(name)')
        .eq('id', projectId)
        .limit(1)
        .single()

      if (!project) continue

      const documents = Array.isArray(project.documents)
        ? [...project.documents]
        : project.documents
        ? [project.documents]
        : []

      const cleanMembers: Member[] = []
      // Fetch the document members
      const { data: members, count } = await supabase
        .from('documents_members')
        .select('role, member:profiles(id, username, avatar_url)', {
          count: 'exact',
        })
        .eq('project_id', project.id)
        .order('added_at', { ascending: true })
        .limit(3)

      for (const doc of members ?? []) {
        const data =
          doc.member && !Array.isArray(doc.member) ? doc.member : null
        let avatar = null
        if (!data) return

        const index = cleanMembers.findIndex((d) => d.id === data.id)

        if (data.avatar_url) {
          const { data: userAvatar } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url)
          avatar = userAvatar.publicUrl
        }

        if (index === -1)
          cleanMembers.push({
            role: doc.role as MemberRole,
            avatar,
            ...data,
          })
      }

      data.push({
        ...project,
        documents,
        team: { members: cleanMembers, count: count ?? 0 },
      })
      return NextResponse.json(data)
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    })
  }
}
