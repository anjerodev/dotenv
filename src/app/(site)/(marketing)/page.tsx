import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import collaborationPreview from '@/assets/members-dialog.png'
import projectsPreview from '@/assets/projects_preview.jpg'
import supabaseDark from '@/assets/supabase-logo-wordmark--dark.png'
import { routes } from '@/constants/routes'

import { commitCount, pullRequestCount, repoInfo } from '@/lib/github'
import { Button } from '@/components/ui/button'
import Blurb from '@/components/blurb'
import HomeSecrets from '@/components/home-secrets'
import { Icons } from '@/components/icons'
import { OSCard } from '@/components/os-card'

export default async function Home() {
  const repoPromise = repoInfo()
  const commitsCountPromise = commitCount()
  const pullRequestCountPromise = pullRequestCount()

  const [repo, commits, pulls] = await Promise.all([
    repoPromise,
    commitsCountPromise,
    pullRequestCountPromise,
  ])

  return (
    <div className="w-full px-8 xl:px-0">
      <section className="w-full py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-7 select-none px-4 text-center font-mono text-3xl font-bold leading-relaxed sm:text-6xl sm:leading-[1.5]">
            Keep all your projects <HomeSecrets /> secure in the same place.
          </div>
          <h2 className="mx-auto mb-16 max-w-md px-4 text-center text-xl font-normal text-muted-foreground">
            A simple open source solution to manage all your projects
            Environment Variables.
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
              pathClassName="fill-brand-500/20"
            />
            <div className="relative z-10 mt-24 overflow-hidden rounded-2xl border border-foreground/10 shadow-2xl">
              <Image src={projectsPreview} alt="dotenv Projects UI Preview" />
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
              pathClassName="fill-amber-500/10"
            />
            <div className="relative z-10">
              <div className="mb-7 flex gap-6">
                <Icons.team
                  strokeWidth={1}
                  className="h-11 w-11 text-amber-500"
                />
                <div className="flex items-center justify-center rounded-lg bg-amber-500/10 px-4 py-2 text-amber-500">
                  <span className="leading-tight">Collaboration</span>
                </div>
              </div>
              <h1 className="title mb-4 font-mono">
                Share the secrets and assign roles to the team members
                effortlessly.
              </h1>
              <p className="text-lg text-foreground/50">
                Don’t send anymore your unprotected secrets by email.
              </p>
            </div>
          </div>
          <div style={{ perspective: 1000 }}>
            <Image
              src={collaborationPreview}
              alt="Collaborate"
              className="shadow-2xl"
              style={{ transform: 'rotateY(-15deg)' }}
            />
          </div>
        </div>
      </section>
      {/* ENCRYPTION SECTION */}
      <section className="flex w-full items-center justify-center py-32">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1">
          <div className="relative text-center">
            <Blurb
              width="100%"
              height="45rem"
              className="absolute inset-x-0 top-[-16rem] z-0"
              pathClassName="fill-emerald-500/10"
            />
            <div className="relative z-10">
              <div className="mb-7 flex justify-center gap-6">
                <Icons.lock
                  strokeWidth={1}
                  className="h-11 w-11 text-emerald-500"
                />
                <div className="flex items-center justify-center rounded-lg bg-emerald-500/10 px-4 py-2 text-emerald-500">
                  <span className="leading-tight">Encryption</span>
                </div>
              </div>
              <h1 className="title mb-4 font-mono">
                Supabase Vault encryption under the hood for high level
                cryptographic algorithms.
              </h1>
              <div className="mx-auto mt-12 w-fit">
                <Image width={258} src={supabaseDark} alt="supabase" />
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
              pathClassName="fill-blue-500/10"
            />
            <div className="relative z-10">
              <div className="mb-7 flex gap-6">
                <Icons.openSource
                  strokeWidth={1}
                  className="h-11 w-11 text-cyan-500"
                />
                <div className="flex items-center justify-center rounded-lg bg-cyan-500/10 px-4 py-2 text-cyan-500">
                  <span className="leading-tight">Open Source</span>
                </div>
              </div>
              <h1 className="title mb-4 font-mono">
                Community driven. Learn, contribute, improve. Let’s make a
                better web together.
              </h1>
              <p className="text-lg text-foreground/50">
                Self host your own copy if you want to.
              </p>
              <div className="mt-12">
                <Link
                  href={routes.GITHUB}
                  className="group flex w-fit gap-4 p-2 text-cyan-500"
                >
                  Check on GitHub
                  <Icons.arrowRight className="-ml-4 opacity-0 transition-all group-hover:translate-x-4 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <OSCard
                title="Commits"
                content={commits ?? ''}
                icon={<Icons.commit />}
              />
              <OSCard
                title="Pull Requests"
                content={pulls ?? ''}
                icon={<Icons.pullRequest />}
              />
              <OSCard
                title="Forks"
                content={repo?.forks ?? ''}
                icon={<Icons.fork />}
              />
              <OSCard
                title="Stars"
                content={repo?.stars ?? ''}
                icon={<Icons.star />}
              />
              <OSCard
                title="Subscribers"
                content={repo?.subscribers ?? ''}
                icon={<Icons.subscribers />}
              />
              <OSCard
                title="Watchers"
                content={repo?.watchers ?? ''}
                icon={<Icons.watchers />}
              />
            </div>
          </div>
        </div>
      </section>
      <footer className="flex w-full items-center justify-center gap-3 px-8 py-3 text-center text-sm">
        <div>
          Developed with 💟 by{' '}
          <a
            href="https://anjero.dev"
            target="_blank"
            className="italic transition hover:text-brand-400"
          >
            anjerodev
          </a>
        </div>
        <span className="h-5 w-0.5 bg-foreground/50" />
        <div>
          Icons:{' '}
          <a
            href="https://lucide.dev/"
            target="_blank"
            className="italic transition hover:text-[#f56565]"
          >
            Lucide
          </a>
        </div>
      </footer>
    </div>
  )
}
