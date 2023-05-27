import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { getProject } from '@/lib/fetching/projects'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Documents, DocumentsContainer } from '@/components/documents-container'
import { Icons } from '@/components/icons'

type PageParamsType = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function Page({ params: { id } }: PageParamsType) {
  const project = await getProject(id)

  if (!project) redirect(routes.PROJECTS)

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-12">
      <Suspense fallback={<Loading />}>
        <DocumentsContainer project={project} />
      </Suspense>
    </div>
  )
}

const Loading = () => {
  return (
    <>
      <div className="mb-12 flex w-full items-center gap-3">
        <Button variant="link" component={Link} href={routes.PROJECTS}>
          All projects
        </Button>
        <Icons.chevronRight size={16} />
        <div className="grow">
          <Skeleton className="h-4 w-36" />
        </div>
        <ActionIcon disabled>
          <Icons.menu />
        </ActionIcon>
      </div>
      <Documents disabled>
        {new Array(2).fill('').map((_, index) => (
          <Skeleton key={index} className="h-[130px] w-full rounded-2xl" />
        ))}
      </Documents>
    </>
  )
}
