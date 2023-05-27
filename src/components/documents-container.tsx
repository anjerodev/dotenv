'use client'

import { useEffect, useReducer, useState } from 'react'
import Link from 'next/link'
import { routes } from '@/constants/routes'
import dayjs from 'dayjs'

import { Document, Project, ProjectType } from '@/types/collections'
import { cn } from '@/lib/cn'
import { updateProject } from '@/lib/mutations/project'
import { useServerMutation } from '@/hooks/useServerMutation'
import useSetParams from '@/hooks/useSetParams'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import DocumentDialog from '@/components/document-dialog'
import { Icons } from '@/components/icons'
import { toast } from '@/components/providers/toast-provider'
import RemoveProjectDialog from '@/components/remove-project-dialog'
import TeamAvatars from '@/components/team-avatars'

type State = {
  editing: boolean
  updates: { name: string; removedDocs: string[] }
  removeProjectDialogIsOpen: boolean
}

type ProjectDocument = Omit<Document, 'updated_by' | 'content'>

interface ProjectInfo extends Omit<Project, 'team' | 'documents'> {
  documents: ProjectDocument[]
}

interface DocumentsContainerProps {
  project: ProjectInfo
}

export function DocumentsContainer({ project }: DocumentsContainerProps) {
  const { setParams } = useSetParams()
  const [open, setOpen] = useState<boolean | string>(false)
  const [mutate, { isPending }] = useServerMutation()

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

  useEffect(() => {
    setState({ updates: { ...state.updates, name: project.name } })
  }, [])

  const openDocument = (value: string) => {
    setParams('doc', value)
    setOpen(value)
  }

  const changeEditing = () => {
    setState({ editing: !state.editing })
  }

  const handleSaveChanges = async () => {
    mutate({
      mutation: updateProject(project.id, state.updates),
      onError: () => {
        toast.error('Error updating', {
          description:
            "Murphy's Law strikes again! We encountered an error while updating the project. But fear not, we won't let this little setback stop us. Let's give it another go!",
        })
      },
      onSuccess: () => {
        toast.error('Error updating', {
          description:
            "Murphy's Law strikes again! We encountered an error while updating the project. But fear not, we won't let this little setback stop us. Let's give it another go!",
        })
      },
    })
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

  const handleRemovedDocs = (docId: string) => {
    const index = state.updates.removedDocs.indexOf(docId)
    let removedDocs = state.updates.removedDocs
    if (index !== -1) {
      removedDocs.splice(index, 1)
    } else {
      removedDocs.push(docId)
    }

    setState({
      updates: {
        ...state.updates,
        removedDocs,
      },
    })
  }

  return (
    <>
      <div className="mb-12 flex w-full items-center gap-3">
        <Button variant="link" component={Link} href={routes.PROJECTS}>
          All projects
        </Button>
        <Icons.chevronRight size={16} />
        {state.editing ? (
          <Input
            disabled={isPending}
            placeholder="Please, fill it up"
            value={state.updates.name}
            onChange={handleNameChange}
          />
        ) : (
          <div className="font-mono text-2xl font-bold">{project.name}</div>
        )}

        <div className="flex grow items-center justify-end">
          {state.editing ? (
            <EditingActions
              saving={isPending}
              onSave={handleSaveChanges}
              onDiscard={handleDiscardChanges}
            />
          ) : (
            <ProjectMenu
              onEdit={changeEditing}
              onRemove={() => handleRemoveProjectDialog(true)}
              disabled={!project}
            />
          )}
        </div>
      </div>
      <Documents
        disabled={state.editing}
        project={project}
        open={open}
        setOpen={setOpen}
      >
        {project.documents?.map((document: ProjectDocument) => (
          <div key={document.id} className="group/card relative">
            <Card
              onClick={() => openDocument(document.id)}
              disabled={state.editing}
              className={cn(
                'relative z-0 h-fit w-full text-start animate-in fade-in-50 zoom-in-90',
                state.updates.removedDocs.includes(document.id) && 'opacity-10'
              )}
            >
              <div className="truncate text-lg font-medium">
                {document.name}
              </div>
              <span className="mt-1 text-sm text-card-foreground/50">
                {dayjs(document.updated_at).format('MMM DD, YYYY')}
              </span>
              <div className="mt-2 flex justify-end">
                <TeamAvatars
                  team={document.team?.members}
                  count={document.team?.count}
                />
              </div>
            </Card>
            {state.editing &&
              (() => {
                // Delete document
                if (!state.updates.removedDocs.includes(document.id)) {
                  return (
                    <ActionIcon
                      onClick={() => handleRemovedDocs(document.id)}
                      className="group/button absolute -right-2 -top-2 z-10 rounded-full border border-foreground/10 bg-background text-destructive shadow-lg hover:bg-[#fdecec]  dark:text-destructive dark:hover:bg-[#2a191b]"
                    >
                      <Icons.trash
                        size={20}
                        className="group-hover/button:!animate-none group-hover/card:animate-shaking"
                      />
                    </ActionIcon>
                  )
                }
                // Undo deletion
                if (state.updates.removedDocs.includes(document.id)) {
                  return (
                    <ActionIcon
                      onClick={() => handleRemovedDocs(document.id)}
                      className="group/button absolute -right-2 -top-2 z-10 rounded-full border border-foreground/10 bg-background text-foreground shadow-lg hover:bg-background/80"
                    >
                      <Icons.undo
                        size={20}
                        className="group-hover/button:!animate-none group-hover/card:animate-shaking"
                      />
                    </ActionIcon>
                  )
                }
              })()}
          </div>
        ))}
      </Documents>
      <RemoveProjectDialog
        open={state.removeProjectDialogIsOpen}
        onOpenChange={handleRemoveProjectDialog}
        project={project}
      />
    </>
  )
}

export const Documents = ({
  disabled,
  project,
  children,
  open = false,
  setOpen = () => false,
}: {
  disabled: boolean
  project?: ProjectType
  children: React.ReactNode

  open?: boolean | string
  setOpen?: (open: boolean) => void
}) => {
  return (
    <>
      <CardsContainer>
        <Card
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="h-full"
        >
          <div className="flex grow flex-col items-center justify-center gap-2 py-4 font-semibold text-card-foreground">
            <Icons.plus size={32} />
            Add document
          </div>
        </Card>
        {children}
      </CardsContainer>
      {project && (
        <DocumentDialog open={open} onOpenChange={setOpen} project={project} />
      )}
    </>
  )
}

interface ProjectMenuProps {
  onEdit: () => void
  onRemove: () => void
  disabled: boolean
}

const ProjectMenu = ({ onEdit, onRemove, disabled }: ProjectMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="transition-all active:scale-95">
        <ActionIcon disabled={disabled}>
          <Icons.menu />
        </ActionIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <Icons.edit size={16} className="mr-2" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="text-destructive focus:bg-destructive/10"
          >
            <Icons.trash size={16} className="mr-2" />
            <span>Remove project</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface EditingActionsProps {
  saving: boolean
  onSave: () => void
  onDiscard: () => void
}

const EditingActions = ({ saving, onSave, onDiscard }: EditingActionsProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionIcon loading={saving} onClick={onSave}>
              <Icons.save />
            </ActionIcon>
          </TooltipTrigger>
          <TooltipContent>Save changes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionIcon disabled={saving} onClick={onDiscard}>
              <Icons.close />
            </ActionIcon>
          </TooltipTrigger>
          <TooltipContent>Discard changes</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
