import { Member, MemberRole, membersActions } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSession } from '@/lib/supabase-server'

type memberType = {
  ref: string
  id: string
  role: MemberRole
  action?: membersActions
}

export const updateProjectMembers = async ({
  projectId,
  documentId,
  members,
}: {
  projectId: string
  documentId: string
  members: memberType[]
}) => {
  try {
    const { supabase, session, error: sessionError } = await getSession()
    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const newMembers = members.filter((m) => m.action === membersActions.CREATE)
    const updatedMembers = members.filter(
      (m) => m.action === membersActions.UPDATE
    )
    const removedMembers = members.filter(
      (m) => m.action === membersActions.REMOVE
    )

    let insertMembersPromise = null
    let updateMembersPromise = null
    let removeMembersPromise = null

    if (newMembers.length) {
      const payload = newMembers.map((member) => ({
        document_id: documentId,
        project_id: projectId,
        role: member.role,
        user_id: member.id,
      }))

      insertMembersPromise = supabase
        .from('documents_members')
        .insert(payload)
        .select('ref:id, role, profile:profiles(id, username, avatar_url)')
    }

    if (updatedMembers.length) {
      const payload = updatedMembers.map((member) => ({
        id: member.ref,
        role: member.role,
        document_id: documentId,
        project_id: projectId,
        user_id: member.id,
      }))

      updateMembersPromise = supabase
        .from('documents_members')
        .upsert(payload)
        .select('ref:id, role')
    }

    if (removedMembers.length) {
      const payload = removedMembers.map((member) => member.ref)
      removeMembersPromise = supabase
        .from('documents_members')
        .delete()
        .in('id', payload)
    }

    const [insert, update, remove] = await Promise.all([
      insertMembersPromise,
      updateMembersPromise,
      removeMembersPromise,
    ])

    if (insert?.error || update?.error || remove?.error) {
      throw new RequestError({
        message: 'Error updating team',
      })
    }

    const inserted: Member[] = []
    const insertedData = insert?.data ?? []
    const updatedData = update?.data ?? []

    insertedData.forEach((member) => {
      if (member.profile && !Array.isArray(member.profile)) {
        const avatar = member.profile.avatar_url
          ? supabase.storage
              .from('avatars')
              .getPublicUrl(member.profile.avatar_url).data.publicUrl
          : null
        const memberData = {
          ref: member.ref,
          role: member.role as MemberRole,
          avatar,
          ...member.profile,
        }
        inserted.push(memberData)
      }
    })

    const result = {
      insert: inserted,
      update: updatedData,
      remove: removedMembers.map((rm) => rm.ref),
    }

    return result
  } catch (error) {
    throw error
  }
}
