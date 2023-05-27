import { Suspense } from 'react'

import { getProjects } from '@/lib/fetching/projects'
import { ProjectCard } from '@/components/project-card'
import { ProjectsContainer } from '@/components/projects-container'
import { Search } from '@/components/search'

import Loading from './loading'

/**
 * Temporal revalidate fix until is posible to revalidate on demand after
 * a document has been updated
 */
export const revalidate = 60

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const search = searchParams?.search ?? ''

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="title">Your Projects</div>
          <div className="w-full max-w-xs">
            <Search />
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          {/* @ts-expect-error Async Server Component */}
          <ProjectData search={search} />
        </Suspense>
      </div>
    </>
  )
}

export const ProjectData = async ({ search }: { search: string }) => {
  const projects = await getProjects()

  return (
    <ProjectsContainer>
      {projects
        .filter((project) =>
          project.name
            .toLocaleLowerCase()
            .includes(search.trim().toLocaleLowerCase())
        )
        .map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
    </ProjectsContainer>
  )
}
