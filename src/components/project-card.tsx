import { routes } from '@/constants/routes'

import { Project } from '@/types/collections'
import { Card } from '@/components/ui/card'
import TeamAvatars from '@/components/team-avatars'

interface CardProjectType extends Omit<Project, 'documents'> {
  documents: { id: string; name: string }[]
}

export function ProjectCard({ project }: { project: CardProjectType }) {
  const documents = project.documents
  const team = project.team

  return (
    <Card
      href={routes.PROJECT(project.id)}
      className="animate-in fade-in-50 zoom-in-90 h-44"
    >
      <div className="mb-2 text-lg font-medium">{project.name}</div>
      {(() => {
        if (documents?.length === 0)
          return <div className="italic text-foreground/40">empty</div>
        if (documents.length > 0)
          return documents.slice(0, 2).map((doc: any) => (
            <div key={doc.id || doc.name} className="text-foreground/60">
              {doc.name}
            </div>
          ))
      })()}
      {documents.length > 2 && <div className='text-foreground/60 -mt-1'>...</div>}
      <div className="absolute inset-x-0 bottom-0 flex justify-end px-5 py-4">
        <TeamAvatars team={team?.members} count={team?.count} />
      </div>
    </Card>
  )
}
