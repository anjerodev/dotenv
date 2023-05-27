import Link from 'next/link'
import { routes } from '@/constants/routes'
import { Session } from '@supabase/supabase-js'

import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

interface GlobalMenuProps {
  session: Session
}

export default function MarketingMenu({ session }: GlobalMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative overflow-hidden rounded-md">
        <ActionIcon
          component={Link}
          href={routes.TWITTER}
          className="peer relative z-10 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
        >
          <Icons.twitter className="h-5 w-5" />
        </ActionIcon>
        <span className="absolute inset-0 -bottom-2 -left-2 z-0 origin-bottom-left scale-0 rounded-full bg-blue-500 opacity-50 transition-all duration-500 peer-hover:scale-150 peer-hover:opacity-100" />
      </div>
      <div className="relative overflow-hidden rounded-md">
        <ActionIcon
          component={Link}
          href={routes.GITHUB}
          className="peer relative z-10 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
        >
          <Icons.github className="h-5 w-5" />
        </ActionIcon>
        <span className="absolute inset-0 -bottom-2 -left-2 z-0 origin-bottom-left scale-0 rounded-full bg-zinc-800 opacity-50 transition-all duration-500 peer-hover:scale-150 peer-hover:opacity-100" />
      </div>

      {session ? (
        <Button
          component={Link}
          href={routes.PROJECTS}
          size="sm"
          className="min-w-fit px-5"
        >
          Dashboard
        </Button>
      ) : (
        <Button
          component={Link}
          href={routes.LOGIN}
          size="sm"
          className="min-w-fit px-5"
        >
          Sign in
        </Button>
      )}
    </div>
  )
}
