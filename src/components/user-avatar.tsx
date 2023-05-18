import { forwardRef } from 'react'
import { User } from 'lucide-react'

import { DefaultProps } from '@/types/styles'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarProps,
} from '@/components/ui/avatar'

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
          <User />
        </AvatarFallback>
      </Avatar>
    )
  }
)

UserAvatar.displayName = 'UserAvatar'

export default UserAvatar
