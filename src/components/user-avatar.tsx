import { forwardRef } from 'react'

import { DefaultProps } from '@/types/styles'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarProps,
} from '@/components/ui/avatar'
import { Icons } from '@/components/icons'

interface UserAvatarProps extends DefaultProps {
  avatar: string
  username: string
}

const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps & AvatarProps>(
  ({ avatar, username, ...props }, ref) => {
    return (
      <Avatar {...props} ref={ref}>
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback className="text-muted-foreground">
          <Icons.user />
        </AvatarFallback>
      </Avatar>
    )
  }
)

UserAvatar.displayName = 'UserAvatar'

export default UserAvatar
