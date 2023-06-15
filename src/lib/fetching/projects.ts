import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import 'server-only'

import { Member, MemberRole } from '@/types/collections'
import { getSession } from '@/lib/supabase-server'

export const getProjects = async () => {
  try {
    const { supabase, session } = await getSession()

    let projects = []

    const { data: ownProjects } = await supabase
      .from('projects')
      .select('id')
      .match({ owner: session.user.id })
      .order('created_at', { ascending: true })

    const userProjects = ownProjects ?? []
    const ownProjectsIds = userProjects.map(({ id }) => id)
    const plainTextOwnProjectsIds = `(${ownProjectsIds
      .map((id) => `"${id}"`)
      .join(',')})`

    const { data: projectsData } = await supabase
      .from('documents_members')
      .select('project_id')
      .eq('user_id', session.user.id)
      .not('project_id', 'in', plainTextOwnProjectsIds)
      .order('project_id', { ascending: true })

    const projectsDataArray = projectsData ?? []
    const uniqueProjectsIds = projectsDataArray.reduce(
      (prev: string[], curr) => {
        return prev.includes(curr.project_id)
          ? prev
          : [...prev, curr.project_id]
      },
      ownProjectsIds
    )

    for (const projectId of uniqueProjectsIds) {
      const projectPromise = supabase
        .from('projects')
        .select('*, ownerProfile:profiles(id, username, avatar_url)')
        .match({ id: projectId })
        .single()

      const documentsPromise = supabase
        .from('documents')
        .select('id, name')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      const membersPromise = supabase
        .from('documents_members')
        .select('role, profile:profiles(id, username, avatar_url)')
        .eq('project_id', projectId)
        .order('added_at', { ascending: true })

      const [project, documents, members] = await Promise.all([
        projectPromise,
        documentsPromise,
        membersPromise,
      ])

      if (!project.data) continue

      const owner = project.data?.ownerProfile
        ? { role: MemberRole.Owner, ...project.data.ownerProfile }
        : null

      const uniqueMembers: Member[] = []
      let membersArray: Member[] = owner ? [owner] : []

      members.data?.forEach((member) => {
        if (!member.profile) return
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

      projects.push({
        id: project.data.id,
        name: project.data.name,
        created_at: project.data.created_at,
        updated_at: project.data.updated_at,
        owner: project.data.owner,
        documents: documents.data ?? [],
        team: {
          members: uniqueMembers,
          count: uniqueMembers.length ?? 0,
        },
      })
    }

    return projects
  } catch (error) {
    throw error
  }
}

export const getProject = async (id: string) => {
  try {
    const { supabase, session } = await getSession()

    const projectPromise = await supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single()
    const projectUserDocuments = await supabase
      .from('documents_members')
      .select('id')
      .match({ project_id: id, user_id: session.user.id })

    const [project, userDocuments] = await Promise.all([
      projectPromise,
      projectUserDocuments,
    ])

    if (project.error) {
      //   TODO: Handle when a project is not found
      redirect(routes.PROJECTS)
    }

    // If current user is not a member of the project redirect to user projects
    const isUserMember =
      session.user.id === project.data.owner ||
      (userDocuments.data && userDocuments.data?.length > 0)
    if (!isUserMember) {
      redirect(routes.PROJECTS)
    }

    return project.data
  } catch (error) {
    throw error
  }
}
