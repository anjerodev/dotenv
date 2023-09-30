'use client'

import { useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, User } from 'lucide-react'

import { Profile } from '@/types/collections'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconButton } from '@/components/ui/icon-button'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/providers/toast-provider'

type AvatarInputProps = {
  user: Profile
}

type State = {
  uploading: boolean
  error: any
}

export function AvatarInput({ user }: AvatarInputProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    { uploading: false, error: null }
  )

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setState({ uploading: true })
      const file = event.target.files && event.target.files[0]

      if (!file) throw new Error('A picture must be selected.')

      const fileSize = file.size
      if (fileSize > 500000)
        throw new Error(
          'Uh-oh, looks like that file is on a burger-and-fries diet. Can you try uploading a lighter file under 500kb?'
        )

      const date = new Date()
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}.${fileExt}`

      const storage = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '0', upsert: true })

      const avatar_url = supabase.storage.from('avatars').getPublicUrl(filePath)
        .data.publicUrl

      const updates = {
        avatar_url,
        updated_at: date.toISOString(),
      }

      const profile = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (storage.error || profile.error) {
        // console.log({ uploadError: storage.error, updateError: profile.error })

        throw new Error(
          "Oh no, we've hit a roadblock. Looks like something went wrong during the file upload. Let's try again and see if we can get it right this time!"
        )
      }

      router.refresh()
    } catch (error: any) {
      toast.error('Error uploading image', { description: error.message })
    } finally {
      setState({ uploading: false })
    }
  }

  return (
    <div className="relative rounded-full p-2">
      <div
        className={cn(
          'absolute inset-0 h-full w-full',
          user.avatar_url && 'duration-1000 animate-in spin-in-45'
        )}
      >
        <svg viewBox="0 0 160 160" fill="none" className="h-full w-full">
          <circle
            cx="80"
            cy="80"
            r="79"
            className={
              user.avatar_url ? 'stroke-brand-500' : 'stroke-muted-foreground'
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="18 20"
          />
        </svg>
      </div>

      <Avatar className="h-36 w-36">
        <AvatarImage
          className="h-36 w-36"
          src={user.avatar_url ?? undefined}
          alt={user.username ?? undefined}
        />
        <AvatarFallback>
          <User size="48" />
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-x-0 bottom-[-15%]">
        <div className="mx-auto w-fit">
          <label
            htmlFor="avatar"
            className="mx-auto block cursor-pointer rounded-full bg-background p-1"
          >
            <IconButton
              component="span"
              loading={state.uploading}
              variant="contrast"
              icon={<Edit />}
            />
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={state.uploading}
              onChange={uploadAvatar}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
