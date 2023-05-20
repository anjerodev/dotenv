import { Suspense } from 'react'

import { getProjects } from '@/lib/fetching/projects'
import { Skeleton } from '@/components/ui/skeleton'
import Search from '@/components/search'

import Project from './project'
import ProjectsContainer from './projectsContainer'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const projects = await getProjects()
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
          <ProjectsContainer>
            {projects &&
              projects
                .filter((project) =>
                  project.name
                    .toLocaleLowerCase()
                    .includes(search.trim().toLocaleLowerCase())
                )
                .map((project) => (
                  // @ts-expect-error Async Server Component
                  <Project
                    key={project.id}
                    projectId={project.id}
                    projectName={project.name}
                  />
                ))}
          </ProjectsContainer>
        </Suspense>
      </div>
    </>
  )
}

const Loading = () => {
  return (
    <ProjectsContainer disabled>
      {new Array(2).fill('').map((_, idx) => (
        <Skeleton
          key={`projects-item-${idx}`}
          className="h-[208px] w-full rounded-2xl"
        />
      ))}
    </ProjectsContainer>
  )
}
