import { Member, MemberRole } from '@/types/collections'

import { RequestError } from '../request-error-handler'
import { getSession } from '../supabase-server'

export const getProjects = async () => {
  try {
    const { supabase, session, error: sessionError } = await getSession()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { data: ownProjects } = await supabase
      .from('projects')
      .select()
      .match({ owner: session.user.id })
      .order('created_at', { ascending: true })

    const userProjects = ownProjects ?? []
    const ownProjectsIds = userProjects.map((project) => project.id)
    const plainTextOwnProjectsIds = `(${ownProjectsIds
      .map((id) => `"${id}"`)
      .join(',')})`

    const { data: documents, error } = await supabase
      .from('documents_members')
      .select('project_id')
      .eq('user_id', session.user.id)
      .not('project_id', 'in', plainTextOwnProjectsIds)
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

    const { data: memberProjects } = await supabase
      .from('projects')
      .select()
      .in('id', projects)
      .order('created_at', { ascending: true })

    const data = userProjects.concat(memberProjects ?? [])

    return data
  } catch (error) {
    throw error
  }
}

export const getProject = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()
    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { data } = await supabase
      .from('projects')
      .select()
      .match({ id })
      .single()

    return data
  } catch (error) {
    throw error
  }
}

export const getProjectPreview = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { data: projectOwner } = await supabase
      .from('projects')
      .select('owner:profiles(id, username, avatar_url)')
      .match({ id })
      .single()

    const owner =
      projectOwner?.owner && !Array.isArray(projectOwner.owner)
        ? [{ role: MemberRole.Owner, ...projectOwner.owner }]
        : []

    const documentsPromise = supabase
      .from('documents')
      .select('id, name')
      .eq('project_id', id)
      .order('created_at', { ascending: true })

    const membersPromise = supabase
      .from('documents_members')
      .select('role, profile:profiles(id, username, avatar_url)', {
        count: 'exact',
      })
      .eq('project_id', id)
      .neq('user_id', owner)
      .order('added_at', { ascending: true })
      .limit(3)

    const uniqueMembers: Member[] = []

    const [documents, members] = await Promise.all([
      documentsPromise,
      membersPromise,
    ])

    const membersCount = (members?.count ?? 0) + 1
    let membersArray: Member[] = owner

    members.data?.forEach((member) => {
      if (!member.profile || Array.isArray(member.profile)) return
      const role = member.role as MemberRole
      membersArray.push({ role, ...member.profile })
    })

    for (const member of membersArray) {
      const index = uniqueMembers.findIndex((d) => d.id === member.id)

      if (index === -1) {
        let avatar = null

        if (member.avatar_url) {
          const { data: userAvatar } = supabase.storage
            .from('avatars')
            .getPublicUrl(member.avatar_url)
          avatar = userAvatar.publicUrl
        }

        uniqueMembers.push({
          avatar,
          ...member,
        })
      }
    }

    const data = {
      documents: documents.data ?? [],
      team: {
        members: uniqueMembers,
        count: membersCount ?? 0,
      },
    }

    return data ?? []
  } catch (error) {
    throw error
  }
}
