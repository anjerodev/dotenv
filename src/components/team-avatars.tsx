import { Member } from '@/types/collections'

import { Avatar, AvatarFallback, AvatarGroup } from './ui/avatar'
import { Skeleton } from './ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import UserAvatar from './user-avatar'

type TeamAvatarType = {
  team?: Member[]
  count?: number
  maxAvatars?: number
  loading?: boolean
}

export default function TeamAvatars({
  team,
  maxAvatars = 3,
  count,
  loading,
}: TeamAvatarType) {
  if (loading)
    return (
      <div className="flex items-center justify-end">
        {new Array(3).fill('').map((_, index) => (
          <div
            key={index}
            className="-ml-2 rounded-full bg-background ring-2 ring-card"
          >
            <Skeleton className="h-9 w-9 animate-skeleton-pulse rounded-full" />
          </div>
        ))}
      </div>
    )

  if (!team) return null

  const hasCount = (count ? count : team.length) > maxAvatars

  return (
    <AvatarGroup spacing="sm">
      <TooltipProvider>
        {team.slice(0, maxAvatars).map((user) => (
          <Tooltip key={user.username}>
            <TooltipTrigger asChild>
              <UserAvatar
                withinGroup
                size="xs"
                avatar={user.avatar_url ?? ''}
                username={user.username ?? ''}
              />
            </TooltipTrigger>
            <TooltipContent>{user.username ?? ''}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      {hasCount && (
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
