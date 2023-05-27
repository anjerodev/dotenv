import { Skeleton } from '@/components/ui/skeleton'
import { ProjectsContainer } from '@/components/projects-container'

export default function Loading() {
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
