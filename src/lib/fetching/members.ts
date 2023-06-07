import { Profile } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { getSession } from '@/lib/supabase-server'

export const getMembers = async ({
  username,
  email,
}: {
  username: string
  email: string
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

    const users: Partial<Profile>[] = []

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .or(`username.ilike.%${username}%,email.ilike.%${email}%`)
      .neq('id', session.user.id)
      .order('username')

    if (error) {
      console.log({ error })
      throw new RequestError({
        message: 'Error finding users',
      })
    }

    if (!data) return users

    for (const user of data) {
      const avatar = user.avatar_url
        ? supabase.storage.from('avatars').getPublicUrl(user.avatar_url).data
            .publicUrl
        : null

      users.push({ ...user, avatar })
    }

    return users
  } catch (error) {
    throw error
  }
}