import Link from 'next/link'
import { routes } from '@/constants/routes'

interface NavbarProps {
  children: React.ReactNode
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className="fixed left-0 top-0 z-20 block w-full">
      <header className="width-before-scroll-bar  relative border-b bg-background border-black">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-8 py-3 sm:h-16">
          <Link href={routes.HOME} className='font-bold text-2xl'>
            .env
          </Link>
          {children}
        </div>
      </header>
    </div>
  )
}
