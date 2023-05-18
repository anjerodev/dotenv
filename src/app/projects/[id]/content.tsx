'use client'

import { useEffect, useReducer } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { routes } from '@/constants/routes'
import dayjs from 'dayjs'
import {
  ChevronRight,
  Edit,
  Plus,
  Save,
  Settings2,
  Trash2,
  X,
} from 'lucide-react'

import { Document } from '@/types/collections'
import useDocuments from '@/hooks/useDocuments'
import useProject from '@/hooks/useProject'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import { Card, CardsContainer } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import TeamAvatars from '@/components/team-avatars'

import DocumentDialog from './document-dialog'
import RemoveProjectDialog from './remove-project-dialog'

type State = {
  editing: boolean
  updates: { name: string; removedDocs: string[] }
  removeProjectDialogIsOpen: boolean
}

export default function PageContent({ id }: { id: string }) {
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    {
      editing: false,
      updates: { name: '', removedDocs: [] },
      removeProjectDialogIsOpen: false,
    }
  )
  const {
    data: project,
    error,
    isLoading,
    removeProject,
    updateProject,
  } = useProject({
    projectId: id,
  })
  const {
    count,
    data: documents,
    isLoading: documentsAreLoading,
  } = useDocuments({ projectId: id })
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (url: string) => {
    router.push(url)
  }

  useEffect(() => {
    if (project && project.name) {
      setState({ updates: { ...state.updates, name: project.name } })
    }
  }, [project])

  const handleEditing = () => {
    setState({ editing: !state.editing })
  }

  const handleSaveChanges = async () => {
    try {
      await updateProject(state.updates)
    } catch (error) {
      console.log({ error })
    }
  }

  const handleDiscardChanges = () => {
    setState({
      editing: !state.editing,
      updates: { name: project?.name ?? '', removedDocs: [] },
    })
  }

  const handleRemoveProjectDialog = (value: boolean) => {
    setState({ removeProjectDialogIsOpen: value })
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setState({
      updates: { ...state.updates, name: value },
    })
  }

  const handleAddRemovedDoc = (docId: string) => {
    setState({
      updates: {
        ...state.updates,
        removedDocs: [...state.updates.removedDocs, docId],
      },
    })
  }

  const filteredDocuments =
    documents && Array.isArray(documents)
      ? documents.filter((doc) => !state.updates.removedDocs.includes(doc.id))
      : []

  return (
    <>
      <div className="mb-12 flex w-full items-center gap-3">
        <Button variant="link" component={Link} href={routes.PROJECTS}>
          All projects
        </Button>
        <ChevronRight size={16} />
        {(() => {
          if (isLoading || !project) return <Skeleton className="h-4 w-36" />
          else if (state.editing)
            return (
              <Input
                placeholder="Please, fill it up"
                value={state.updates.name}
                onChange={handleNameChange}
              />
            )
          return (
            <div className="font-mono text-2xl font-bold">{project.name}</div>
          )
        })()}
        <div className="flex grow items-center justify-end">
          {state.editing ? (
            <EditingActions
              onSave={handleSaveChanges}
              onDiscard={handleDiscardChanges}
            />
          ) : (
            <ProjectMenu
              onEdit={handleEditing}
              onRemove={() => handleRemoveProjectDialog(true)}
              disabled={!project}
            />
          )}
        </div>
      </div>
      <CardsContainer>
        <Card
          onClick={() => handleClick(`${pathname}?new=true`)}
          disabled={!project || state.editing}
          className="h-full"
        >
          <div className="flex grow flex-col items-center justify-center gap-2 font-semibold text-card-foreground">
            <Plus size={32} />
            Add document
          </div>
        </Card>
        {/* Loading cards */}
        {count && documentsAreLoading ? (
          new Array(count)
            .fill('')
            .map((_, index) => (
              <Skeleton key={index} className="h-[130px] rounded-xl" />
            ))
        ) : (
          <>
            {/* Documents */}
            {filteredDocuments?.map((document: Document) => (
              <div key={document.id} className="group/card relative">
                <Card
                  onClick={() => handleClick(`${pathname}?doc=${document.id}`)}
                  disabled={!project || state.editing}
                  className="relative z-0 h-fit w-full text-start"
                >
                  <div className="truncate text-lg font-medium">
                    {document.name}
                  </div>
                  <span className="mt-1 text-sm text-card-foreground/50">
                    {dayjs(document.updated_at).format('MMM DD, YYYY')}
                  </span>
                  <div className="mt-2 flex justify-end">
                    <TeamAvatars
                      team={document.team.members}
                      count={document.team.count}
                    />
                  </div>
                </Card>
                {state.editing && (
                  <ActionIcon
                    onClick={() => handleAddRemovedDoc(document.id)}
                    className="group/button absolute -right-2 -top-2 z-10 rounded-full border border-foreground/10 bg-background text-destructive shadow-lg hover:bg-[#fdecec] dark:border-zinc-800 dark:text-destructive dark:hover:bg-[#2a191b]"
                  >
                    <Trash2
                      size={20}
                      className="group-hover/button:!animate-none group-hover/card:animate-shaking"
                    />
                  </ActionIcon>
                )}
              </div>
            ))}
          </>
        )}
      </CardsContainer>
      {project && (
        <>
          <DocumentDialog projectId={project.id} projectName={project.name} />
          <RemoveProjectDialog
            open={state.removeProjectDialogIsOpen}
            onOpenChange={handleRemoveProjectDialog}
            project={project}
            onSucced={removeProject}
          />
        </>
      )}
    </>
  )
}

type ProjectMenuProps = {
  onEdit: () => void
  onRemove: () => void
  disabled: boolean
}

const ProjectMenu = ({ onEdit, onRemove, disabled }: ProjectMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="transition-all active:scale-95">
        <ActionIcon disabled={disabled}>
          <Settings2 />
        </ActionIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Remove project</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type EditingActionsProps = {
  onSave: () => void
  onDiscard: () => void
}

const EditingActions = ({ onSave, onDiscard }: EditingActionsProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionIcon onClick={onSave}>
              <Save />
            </ActionIcon>
          </TooltipTrigger>
          <TooltipContent>Save changes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionIcon onClick={onDiscard}>
              <X />
            </ActionIcon>
          </TooltipTrigger>
          <TooltipContent>Discard changes</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
