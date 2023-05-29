'use client'

import { Profile } from '@/types/collections'
import { updateProfile } from '@/lib/server-mutations/profile'
import {
  profileUserNameSchema,
  profileWebsiteSchema,
} from '@/lib/validations/profile'
import { Icons } from '@/components/icons'
import { toast } from '@/components/providers/toast-provider'

import { InputForm } from './input-form'

interface UserInfoProps {
  user: Profile
}

export function UserForm({ user }: UserInfoProps) {
  const handleSubmit = (values: { [x: string]: any }) => {
    return updateProfile(user.id, values)
  }

  return (
    <>
      <InputForm
        id="username"
        icon={Icons.user}
        placeholder="Username"
        validationSquema={profileUserNameSchema}
        initialValue={user.username}
        onSubmit={handleSubmit}
        onSucced={() =>
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
        validationSquema={profileWebsiteSchema}
        initialValue={user.website}
        onSubmit={handleSubmit}
        onSucced={() =>
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
