import { LoginForm } from '@/components/forms/login-form'
import { Logo } from '@/components/logo'

import '@/styles/animations.css'

import Image from 'next/image'

export default async function LoginPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Left/Top Column */}

      <div className="flex w-full items-center justify-center px-8 py-16">
        <div className="w-full max-w-lg">
          <div>
            <Logo />
            <div className="mt-16 flex items-center gap-3">
              <div className="font-mono text-4xl font-medium">Welcome</div>
              <Image
                width={32}
                height={32}
                src="/assets/vulcan_salute_3d.png"
                alt="salute"
              />
            </div>
            <p className="mt-4">
              We want to make it <span className="text-brand-500">simple</span>,
              so you don’t need a password. Just enter your email and we’ll send
              you a magic link that lets you sign in.
            </p>
            <p>
              If you don’t have an account yet, we’ll create one for you
              automatically.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right/Bottom Column */}

      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-[hsla(193,100%,24%,1)] px-8 py-16 before:absolute before:inset-0 before:z-10 before:-translate-x-2 before:-translate-y-2 before:scale-110 before:bg-[url('/grid.svg')] before:bg-repeat before:content-['']">
        {/* Center Container */}
        <div className="relative z-20 flex h-full items-center justify-center">
          {/* Translucent Card */}
          <div className="relative w-11/12 max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-background/20 px-12 py-16 shadow-lg backdrop-blur-[2px] md:w-[85%]">
            <div className="relative z-30">
              <h1 className="mb-6 leading-tight">
                A simple and secure storage to manage yours{' '}
                <span className="font-mono text-brand-400">
                  Environment Variables.
                </span>
              </h1>
              <p className="italic">
                An open source project from developers for developers.
              </p>
            </div>
          </div>
        </div>
        {/* Bubbles */}
        <div className="bubble float_1 absolute bottom-[-100px] right-[-100px] z-0 h-[300px] w-[300px] rounded-full bg-emerald-500/20 blur-2xl" />
        <div className="bubble float_3 absolute bottom-[-100px] left-[-300px] z-0 h-[600px] w-[600px] rounded-full bg-pink-500/25 blur-2xl" />
      </div>
    </div>
  )
}
