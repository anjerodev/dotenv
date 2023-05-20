import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'
import { ChevronRight, Settings2 } from 'lucide-react'

import { getProjectDocuments } from '@/lib/fetching/documents'
import { getProject } from '@/lib/fetching/projects'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import PageContent, { DocumentsContainer } from './content'

type PageParamsType = {
  params: { id: string }
}

export default async function Page({ params: { id } }: PageParamsType) {
  const projectPromise = getProject(id)
  const projectDocumentsPromise = getProjectDocuments(id)

  const [project, documents] = await Promise.all([
    projectPromise,
    projectDocumentsPromise,
  ])

  if (!project) redirect(routes.PROJECTS)

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-12">
      <Suspense fallback={<Loading />}>
        <PageContent documents={documents} project={project} />
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
        <ChevronRight size={16} />
        <div className="grow">
          <Skeleton className="h-4 w-36" />
        </div>
        <ActionIcon disabled>
          <Settings2 />
        </ActionIcon>
      </div>
      <DocumentsContainer disabled>
        {new Array(2).fill('').map((_, index) => (
          <Skeleton key={index} className="h-[130px] w-full rounded-2xl" />
        ))}
      </DocumentsContainer>
    </>
  )
}
