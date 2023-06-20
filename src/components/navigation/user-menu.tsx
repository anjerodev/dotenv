'use client'

import Link from 'next/link'
import { routes } from '@/constants/routes'

import { Profile } from '@/types/collections'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/icons'
import UserAvatar from '@/components/user-avatar'

import { useAuth } from '../providers/supabase-auth-provider'

interface UserMenuProps {
  user: Profile
}

export default function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useAuth()

  if (!user) return <Skeleton className="h-10 w-10 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="transition-all active:scale-95">
        <div className="cursor-pointer rounded-full bg-transparent p-1 transition-all duration-500 hover:bg-brand-300/20">
          <UserAvatar
            size="xs"
            avatar={user?.avatar ?? ''}
            username={user?.username ?? ''}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="block">
            <div className="font-normal">Logged in as:</div>
            {user?.username ?? user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={routes.ACCOUNT}>
              <DropdownMenuItem>
                <Icons.user size={16} className="mr-2" />
                <span>My account</span>
              </DropdownMenuItem>
            </Link>
            <Link href={routes.PROJECTS}>
              <DropdownMenuItem>
                <Icons.projects size={16} className="mr-2" />
                <span>My projects</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href={routes.GITHUB}>
            <DropdownMenuItem>
              <Icons.github size={16} className="mr-2" />
              <span>GitHub</span>
            </DropdownMenuItem>
          </Link>
          <Link href={routes.TWITTER}>
            <DropdownMenuItem>
              <Icons.twitter size={16} className="mr-2" />
              <span>Twitter</span>
            </DropdownMenuItem>
          </Link>
          {/* <Link href={routes.SUPPORT}>
            <DropdownMenuItem>
              <Icons.help size={16} className="mr-2" />
              <span>Support</span>
            </DropdownMenuItem>
          </Link> */}
          {/* <DropdownMenuLabel className="font-normal">
            <span className="text-muted-foreground">Theme</span>
          </DropdownMenuLabel>
          <ThemeToggle /> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={signOut}
            className="text-destructive focus:bg-destructive/10"
          >
            <Icons.logOut size={16} className="mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
