import Image from 'next/image'
import Link from 'next/link'
import projectsPreview from '@/assets/projects_preview.jpg'
import supabaseDark from '@/assets/supabase-logo-wordmark--dark.png'
import supabaseLight from '@/assets/supabase-logo-wordmark--light.png'
import { routes } from '@/constants/routes'
import { ArrowRight, Lock, Users2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Blurb from '@/components/blurb'
import HomeSecrets from '@/components/home-secrets'

export default async function Home() {
  return (
    <div className="px-8 xl:px-0">
      <section className="min-h-screen w-full py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-7 select-none px-4 text-center font-mono text-3xl font-bold leading-relaxed sm:text-6xl sm:leading-[1.5]">
            Keep all your projects <HomeSecrets /> secure in the same place.
          </div>
          <h2 className="mx-auto mb-16 max-w-md px-4 text-center text-xl font-normal text-muted-foreground">
            A simple open source solution to manage all your .env files.
          </h2>
          <div className="relative z-10 mx-auto block w-fit">
            <Button
              component={Link}
              href={routes.LOGIN}
              className="h-14 px-10 shadow-xl"
            >
              Start now for free
            </Button>
          </div>
          <div className="relative">
            <Blurb
              width="100%"
              height="50rem"
              className="absolute inset-x-0 top-[-15rem] z-0"
              pathClassName="fill-brand-600/50 dark:fill-brand-500/20"
            />
            <div className="relative z-10 mt-24 overflow-hidden rounded-2xl border border-foreground/10 shadow-2xl">
              <Image src={projectsPreview} alt="Envox Projects UI Preview" />
            </div>
          </div>
        </div>
      </section>
      {/* COLLABORATION SECTION */}
      <section className="flex w-full items-center justify-center py-32">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <Blurb
              width="125%"
              height="50rem"
              className="absolute inset-x-0 left-[-10rem] top-[-20rem] z-0"
              pathClassName="fill-amber-600/10 dark:fill-amber-500/5"
            />
            <div className="relative z-10">
              <div className="mb-7 flex gap-6">
                <Users2 strokeWidth={1} className="h-11 w-11 text-amber-500" />
                <div className="flex items-center justify-center rounded-lg bg-amber-500/10 px-4 py-2 text-amber-500">
                  <span className="leading-tight">Collaboration</span>
                </div>
              </div>
              <h1 className="mb-4 font-mono">
                Share the secrets and assign roles to the team members
                effortlessly.
              </h1>
              <p className="text-lg text-foreground/50">
                Don’t send anymore your unprotected secrets by email, chats or
                in task management apps.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-black"></div>
        </div>
      </section>
      {/* ENCRYPTION SECTION */}
      <section className="flex w-full items-center justify-center py-32">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1">
          <div className="relative text-center">
            <Blurb
              width="100%"
              height="50rem"
              className="absolute inset-x-0 top-[-25rem] z-0"
              pathClassName="fill-emerald-600/10 dark:fill-emerald-500/5"
            />
            <div className="relative z-10">
              <div className="mb-7 flex justify-center gap-6">
                <Lock strokeWidth={1} className="h-11 w-11 text-emerald-500" />
                <div className="flex items-center justify-center rounded-lg bg-emerald-500/10 px-4 py-2 text-emerald-500">
                  <span className="leading-tight">Encryption</span>
                </div>
              </div>
              <h1 className="mb-4 font-mono">
                PostgreSQL pgsodium encryption under the hood for high level
                cryptographic algorithms.
              </h1>
              <p className="text-lg text-foreground/50">
                The versatility of supabase + the strength of pgsodium library.
              </p>
              <div className="mx-auto mt-12 w-fit">
                <Image
                  width={258}
                  src={supabaseLight}
                  alt="supabase"
                  className="block dark:hidden"
                />
                <Image
                  width={258}
                  src={supabaseDark}
                  alt="supabase"
                  className="hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* OPEN SOURCE SECTION */}
      <section className="flex w-full items-center justify-center py-32">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <Blurb
              width="125%"
              height="50rem"
              className="absolute inset-x-0 left-[-10rem] top-[-20rem] z-0"
              pathClassName="fill-blue-600/10 dark:fill-blue-500/5"
            />
            <div className="relative z-10">
              <div className="mb-7 flex gap-6">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <path
                    d="M27.6673 39.4392C31.8193 38.0902 35.3536 35.3039 37.6347 31.5816C39.9157 27.8593 40.7937 23.4453 40.1108 19.1334C39.4278 14.8215 37.2288 10.8948 33.9091 8.05959C30.5895 5.22434 26.3671 3.66663 22.0015 3.66663C17.6359 3.66662 13.4135 5.22434 10.0939 8.05958C6.77423 10.8948 4.57517 14.8215 3.89224 19.1334C3.2093 23.4453 4.08731 27.8593 6.36834 31.5816C8.64937 35.3039 12.1837 38.0902 16.3357 39.4392L20.2642 27.3486C18.991 26.9349 17.9073 26.0806 17.2078 24.9392C16.5084 23.7978 16.2392 22.4443 16.4486 21.1221C16.658 19.8 17.3323 18.5959 18.3502 17.7265C19.3681 16.8571 20.6629 16.3795 22.0015 16.3795C23.3402 16.3795 24.6349 16.8571 25.6528 17.7265C26.6707 18.5959 27.345 19.8 27.5544 21.1221C27.7639 22.4443 27.4946 23.7978 26.7952 24.9392C26.0957 26.0806 25.012 26.9349 23.7388 27.3486L27.6673 39.4392Z"
                    strokeWidth="2"
                    className="stroke-cyan-500"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="flex items-center justify-center rounded-lg bg-cyan-500/10 px-4 py-2 text-cyan-500">
                  <span className="leading-tight">Open Source</span>
                </div>
              </div>
              <h1 className="mb-4 font-mono">
                Community driven. Code, contribute, improve. Let’s make a better
                web together.
              </h1>
              <p className="text-lg text-foreground/50">
                Self host your own copy if you want.
              </p>
              <div className="mt-12">
                <Link
                  href={routes.GITHUB}
                  className="group flex w-fit gap-4 p-2 text-cyan-500"
                >
                  Check on GitHub
                  <ArrowRight className="-ml-4 opacity-0 transition-all group-hover:translate-x-4 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-black"></div>
        </div>
      </section>
    </div>
  )
}
