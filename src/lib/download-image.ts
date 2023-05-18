import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'

export const downloadImage = async ({
  supabase,
  path,
}: {
  supabase: SupabaseClient
  path: string | undefined | null
}): Promise<string | null> => {
  try {
    if (!path) throw new Error('No image passed.')

    const { data, error } = await supabase.storage
      .from('avatars')
      .download(path)

    if (error) {
      throw error
    }
    const avatar = URL.createObjectURL(data)
    return avatar
  } catch (error) {
    console.log('Error downloading image: ', error)
    return null
  }
}
