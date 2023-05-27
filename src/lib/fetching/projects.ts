import { Member, MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSession } from '@/lib/supabase-server'

export const getProjects = async () => {
  try {
    const { supabase, user, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    let projects = []

    const { data: ownProjects } = await supabase
      .from('projects')
      .select('id')
      .match({ owner: user.id })
      .order('created_at', { ascending: true })

    const userProjects = ownProjects ?? []
    const ownProjectsIds = userProjects.map(({ id }) => id)
    const plainTextOwnProjectsIds = `(${ownProjectsIds
      .map((id) => `"${id}"`)
      .join(',')})`

    const { data: projectsData } = await supabase
      .from('documents_members')
      .select('project_id')
      .eq('user_id', user.id)
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
        .select('role, profile:profiles(id, username, avatar_url)', {
          count: 'exact',
        })
        .eq('project_id', projectId)
        .order('added_at', { ascending: true })

      const [project, documents, members] = await Promise.all([
        projectPromise,
        documentsPromise,
        membersPromise,
      ])

      if (!project.data) continue

      const owner =
        project.data?.ownerProfile && !Array.isArray(project.data.ownerProfile)
          ? { role: MemberRole.Owner, ...project.data.ownerProfile }
          : null

      const uniqueMembers: Member[] = []
      const membersCount = members?.count ?? 0
      let membersArray: Member[] = owner ? [owner] : []

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

      projects.push({
        id: project.data.id,
        name: project.data.name,
        created_at: project.data.created_at,
        updated_at: project.data.updated_at,
        owner: project.data.owner,
        documents: documents.data ?? [],
        team: {
          members: uniqueMembers,
          count: membersCount ?? 0,
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
    const { supabase, error: sessionError } = await getSession()
    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const pojectPromise = supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single()

    const documentsPromise = getProjectDocuments(id)

    const [project, documents] = await Promise.all([
      pojectPromise,
      documentsPromise,
    ])

    if (!project.data) return null

    const data = {
      ...project.data,
      documents,
    }

    return data
  } catch (error) {
    throw error
  }
}

const getProjectDocuments = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select()
      .eq('project_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }

    const data = []

    // Fetch the document data
    for (const document of documents) {
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
        .select('role, profile:profiles(id, username, avatar_url)', {
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
        continue
      }

      const team: Member[] = []

      if (teamData) {
        for (const member of teamData.data) {
          const { role, profile } = member
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

      data.push({
        ...document,
        ...lastUpdateData.data,
        team: {
          members: team,
          count: teamData.count ?? 0,
        },
      })
    }

    return data
  } catch (error: any) {
    throw error
  }
}
