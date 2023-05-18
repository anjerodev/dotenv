'use client'

import { useEffect, useReducer } from 'react'
import { Edit, User } from 'lucide-react'

import { cn } from '@/lib/cn'
import { downloadImage } from '@/lib/download-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconButton } from '@/components/ui/icon-button'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/providers/toast-provider'

type AvatarInputProps = {
  uid: string | undefined
  avatar: string | undefined
  username: string | undefined
}

type State = {
  uploading: boolean
  avatar: string | undefined
  error: any
}

export default function AvatarInput({
  uid,
  avatar,
  username,
}: AvatarInputProps) {
  const { supabase } = useSupabase()
  const { updateCache } = useAuth()
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    { uploading: false, avatar, error: null }
  )

  useEffect(() => {
    if (avatar) {
      setState({ avatar: avatar })
    }
  }, [avatar])

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setState({ uploading: true })
      const file = event.target.files && event.target.files[0]

      if (!uid) throw new Error('You must to login.')

      if (!file) throw new Error('A picture must be selected.')

      const fileSize = file.size
      if (fileSize > 500000)
        throw new Error(
          'Uh-oh, looks like that file is on a burger-and-fries diet. Can you try uploading a lighter file under 500kb?'
        )

      const fileExt = file.name.split('.').pop()
      const fileName = `${uid}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      const updates = {
        id: uid,
        avatar_url: filePath,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (uploadError || error) {
        console.log({ uploadError, error })
        throw new Error(
          "Oh no, we've hit a roadblock. Looks like something went wrong during the file upload. Let's try again and see if we can get it right this time!"
        )
      }

      const avatar = await downloadImage({ supabase, path: filePath })
      if (avatar) {
        updateCache({ avatar, avatar_url: filePath })
        setState({ avatar })
      }
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
          uid && state.avatar && 'animate-in spin-in-45 duration-1000'
        )}
      >
        <svg viewBox="0 0 160 160" fill="none" className="h-full w-full">
          <circle
            cx="80"
            cy="80"
            r="79"
            className={
              uid && state.avatar
                ? 'stroke-brand-500'
                : 'stroke-muted-foreground'
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="18 20"
          />
        </svg>
      </div>

      <Avatar className="h-36 w-36">
        <AvatarImage className="h-36 w-36" src={state.avatar} alt={username} />
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
              disabled={!uid}
              variant="contrast"
              icon={<Edit />}
            />
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={state.uploading || !uid}
              onChange={uploadAvatar}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
