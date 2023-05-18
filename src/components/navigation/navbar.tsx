'use client'

import { MouseEventHandler } from 'react'
import Link from 'next/link'
import { routes } from '@/constants/routes'
import { Session } from '@supabase/supabase-js'
import {
  FolderClosed,
  Github,
  LifeBuoy,
  LogOut,
  Twitter,
  User,
} from 'lucide-react'

import { Profile } from '@/types/collections'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
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
import Logo from '@/components/Logo'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import UserAvatar from '@/components/user-avatar'

const Navbar = ({ session }: { session: Session | null }) => {
  const { user, signOut, isLoading } = useAuth()

  return (
    <header className="width-before-scroll-bar relative border-b border-zinc-200 bg-background dark:border-black">
      {/* Container */}
      <div className="mx-auto flex max-h-16 w-full max-w-7xl items-center justify-between px-8 py-3">
        {/* Logo */}
        <Link href={routes.HOME}>
          <Logo width={120} />
        </Link>

        {(() => {
          if (session) {
            if (isLoading || !user)
              return <Skeleton className="h-10 w-10 rounded-full" />
            return (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="transition-all active:scale-95"
                >
                  <div className="cursor-pointer rounded-full bg-transparent p-1 transition-all duration-500 hover:bg-brand-600/20 dark:hover:bg-brand-300/20">
                    <UserAvatar
                      size="xs"
                      avatar={user?.avatar ?? ''}
                      username={user?.username ?? ''}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent className="w-56" align="end">
                    <LoggedInMenu user={user} onSignOut={signOut} />
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            )
          }

          return <LoggedOutMenu />
        })()}
      </div>
    </header>
  )
}

export default Navbar

const LoggedInMenu = ({
  user,
  onSignOut,
}: {
  user: Profile
  onSignOut: MouseEventHandler<HTMLDivElement>
}) => (
  <>
    <DropdownMenuLabel className="block">
      <div className="font-normal">Logged in as:</div>
      {user?.username ?? user?.email}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <Link href={routes.ACCOUNT}>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>My account</span>
          {/* <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </Link>
      <Link href={routes.PROJECTS}>
        <DropdownMenuItem>
          <FolderClosed className="mr-2 h-4 w-4" />
          <span>My projects</span>
          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </Link>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <Link href={routes.GITHUB}>
      <DropdownMenuItem>
        <Github className="mr-2 h-4 w-4" />
        <span>GitHub</span>
      </DropdownMenuItem>
    </Link>
    <Link href={routes.TWITTER}>
      <DropdownMenuItem>
        <Twitter className="mr-2 h-4 w-4" />
        <span>Twitter</span>
      </DropdownMenuItem>
    </Link>
    <Link href={routes.SUPPORT}>
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
    </Link>
    <DropdownMenuSeparator />
    <DropdownMenuLabel className="font-normal">
      <span className="text-muted-foreground">Theme</span>
    </DropdownMenuLabel>
    <ThemeToggle />
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={onSignOut}
      className="text-destructive focus:bg-destructive/10"
    >
      <LogOut className="mr-2 h-4 w-4 " />
      <span>Log out</span>
      {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
    </DropdownMenuItem>
  </>
)

const LoggedOutMenu = () => (
  <div className="flex items-center gap-4">
    <div className="relative overflow-hidden rounded-md">
      <ActionIcon
        component={Link}
        href={routes.TWITTER}
        className="peer relative z-10 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
      >
        <Twitter className="h-5 w-5" />
      </ActionIcon>
      <span className="absolute inset-0 -bottom-2 -left-2 z-0 origin-bottom-left scale-0 rounded-full bg-blue-500 opacity-50 transition-all duration-500 peer-hover:scale-150 peer-hover:opacity-100" />
    </div>
    <div className="relative overflow-hidden rounded-md">
      <ActionIcon
        component={Link}
        href={routes.GITHUB}
        className="peer relative z-10 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
      >
        <Github className="h-5 w-5" />
      </ActionIcon>
      <span className="absolute inset-0 -bottom-2 -left-2 z-0 origin-bottom-left scale-0 rounded-full bg-zinc-800 opacity-50 transition-all duration-500 peer-hover:scale-150 peer-hover:opacity-100" />
    </div>

    <Button
      component={Link}
      href={routes.LOGIN}
      size="sm"
      className="min-w-fit px-5"
    >
      Sign in
    </Button>
  </div>
)
