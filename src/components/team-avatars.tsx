import { Avatar, AvatarFallback, AvatarGroup } from './ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import UserAvatar from './user-avatar'
import { Member } from '@/types/collections'

type TeamAvatarType = {
  team: Member[]
  count?: number
  maxAvatars?: number
}

export default function TeamAvatars({
  team,
  maxAvatars = 3,
  count,
}: TeamAvatarType) {
  return (
    <AvatarGroup spacing="sm">
      <TooltipProvider>
        {team.slice(0, maxAvatars).map((user) => (
          <Tooltip key={user.username}>
            <TooltipTrigger asChild>
              <UserAvatar
                withinGroup
                size="xs"
                avatar={user.avatar ?? ''}
                username={user.username ?? ''}
              />
            </TooltipTrigger>
            <TooltipContent>{user.username ?? ''}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      {((!count && team.length > maxAvatars) ||
        (count && count > maxAvatars)) && (
        <Avatar size="xs" withinGroup>
          <AvatarFallback>
            <div className="flex items-center">
              <span className="text-xs">+</span>
              {count ? count - maxAvatars : team.length - maxAvatars}
            </div>
          </AvatarFallback>
        </Avatar>
      )}
    </AvatarGroup>
  )
}
