import { Profile } from '@/types/collections'
import { RequestError } from '@/lib/errors'
import { getSession } from '@/lib/supabase-server'

export const getMembers = async ({
  username,
  email,
}: {
  username: string
  email: string
}) => {
  try {
    const { supabase, session } = await getSession()

    const users: Partial<Profile>[] = []

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .or(`username.ilike.%${username}%,email.ilike.%${email}%`)
      .neq('id', session.user.id)
      .order('username')
      .limit(3)

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
