import Link from 'next/link'
import { routes } from '@/constants/routes'

import Logo from '@/components/logo'

interface NavbarProps {
  children: React.ReactNode
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className="fixed left-0 top-0 z-20 block w-full">
      <header className="width-before-scroll-bar  relative border-b border-zinc-200 bg-background dark:border-black">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-8 py-3 sm:h-16">
          <Link href={routes.HOME}>
            <Logo width={120} />
          </Link>
          {children}
        </div>
      </header>
    </div>
  )
}
