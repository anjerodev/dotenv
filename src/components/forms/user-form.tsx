'use client'

import { Profile } from '@/types/collections'
import {
  profileUserNameSchema,
  profileWebsiteSchema,
} from '@/lib/validations/profile'
import { Icons } from '@/components/icons'
import { toast } from '@/components/providers/toast-provider'

import { InputForm } from './input-form'

interface UserInfoProps {
  user: Profile
  onSubmit: (values: { [x: string]: string }) => Promise<any>
}

export function UserForm({ user, onSubmit }: UserInfoProps) {
  return (
    <>
      <InputForm
        id="username"
        icon={Icons.user}
        placeholder="Username"
        validationSchema={profileUserNameSchema}
        initialValue={user.username}
        onSubmit={onSubmit}
        onSuccess={() =>
          toast.success('Great!', {
            description:
              "Congratulations, you've successfully renamed yourself! Your new username is good to go.",
          })
        }
        onError={(error) => toast.error('Upps!', { description: error })}
      />
      <InputForm
        id="website"
        icon={Icons.website}
        placeholder="Website"
        validationSchema={profileWebsiteSchema}
        initialValue={user.website}
        onSubmit={onSubmit}
        onSuccess={() =>
          toast.success('Success!', {
            description:
              'Ta-da! Your website field has been successfully updated. Give yourself a high five!🤚',
          })
        }
        onError={(error) => toast.error('Upps!', { description: error })}
      />
    </>
  )
}
