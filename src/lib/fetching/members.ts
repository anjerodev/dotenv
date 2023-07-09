import { RequestError } from '@/lib/errors'
import { getRouteHandlerSession } from '@/lib/supabase-server'

export const getMembers = async ({
  username,
  email,
}: {
  username: string
  email: string
}) => {
  try {
    const { supabase, session } = await getRouteHandlerSession()

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

    if (!data) return []

    return data
  } catch (error) {
    throw error
  }
}
