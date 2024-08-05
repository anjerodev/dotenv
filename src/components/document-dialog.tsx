'use client'

import React, { useEffect, useState } from 'react'
import { type UseFormReturnType } from '@mantine/form'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { MemberRole, ProjectType } from '@/types/collections'
import { useClipboard } from '@/hooks/useClipboard'
import useDocument from '@/hooks/useDocument'
import { useDocuments } from '@/hooks/useDocuments'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import useSetParams from '@/hooks/useSetParams'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Icons } from '@/components/icons'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { toast } from '@/components/providers/toast-provider'
import TeamAvatars from '@/components/team-avatars'

import TeamDialog from './team-dialog'

dayjs.extend(utc)
dayjs.extend(timezone)

type FormType = {
  name: string
  content: string
}

export default function DocumentDialog({
  project,
  documentId,
  open,
  onOpenChange,
  form,
}: {
  project: ProjectType
  documentId: string | null
  open: boolean | string
  onOpenChange: (open: boolean) => void
  form: UseFormReturnType<FormType>
}) {
  const { user } = useAuth()
  const { cleanParams } = useSetParams()

  const initialLoading = typeof open === 'string'
  const {
    data,
    isLoading,
    update,
    isPending: isUpdating,
  } = useDocument({ id: documentId, initialLoading })
  const { create, isPending: isCreating } = useDocuments(project.id)

  const [isFocused, setIsFocused] = useState(false)

  const clipboard = useClipboard()
  const download = useDownloadFile({ format: 'env' })

  useEffect(() => {
    let values = { name: '', content: '' }

    if (data) {
      values = {
        name: data?.name ? data.name.replace(/\.env\.?/g, '') : '',
        content: data?.content ?? '',
      }
    }

    form.setValues(values)
    form.resetDirty(values)
  }, [data])

  const handleCopy = () => {
    clipboard.copy(form.values.content)
  }

  const handleDownload = () => {
    const values = form.getTransformedValues()
    download.download({
      data: values.content,
      filename: project.name + values.name,
    })
  }

  const onClose = () => {
    if (documentId) {
      cleanParams()
    }
    onOpenChange(false)
  }

  const handleError = (error: {
    message: string
    form?: { [key: string]: string }
  }) => {
    const errorMessages = error?.form
    if (errorMessages) {
      form.setErrors({ ...form.errors, ...errorMessages })
    } else {
      toast.error('Error submitting form.', {
        description: error.message,
      })
    }
  }

  const handleSubmit = async (values: FormType) => {
    try {
      if (data) {
        // Is updating
        /**
         * If the name does not change, we pass it as null to avoid
         * check documents with the same name within the project
         */
        const newName = values.name !== data!.name ? values.name : null
        await update(project.id, {
          name: newName,
          content: values.content,
        })
        toast.success('Success', {
          description:
            'Woohoo! The document update is complete and everything is looking spick and span.',
        })
        onClose()
      } else {
        // Is creating a new document
        await create(values)
        toast.success('Success', {
          description:
            'Congratulations! The document has been created successfully.',
        })
        onClose()
      }
    } catch (error: any) {
      handleError(error)
    }
  }

  let userRole: MemberRole | null = null

  if (!user) {
    userRole = null
  } else if (!data?.team || !data.team.members.length) {
    userRole = MemberRole.Owner
  } else {
    const teamMember = data.team.members.find((member) => member.id === user.id)
    userRole = teamMember?.role ?? null
  }

  const canEdit = userRole
    ? [MemberRole.Owner, MemberRole.Editor].includes(userRole)
    : false

  const updatedDate =
    data?.updated_at && dayjs(data?.updated_at).format('MMM DD, YYYY')

  const isPending = isCreating || isUpdating

  return (
    <Dialog open={Boolean(open)} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        closeButton={false}
        className="w-full sm:max-w-3xl"
      >
        <DialogTitle hidden></DialogTitle>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-3"
        >
          <div
            aria-label="Document name container"
            className="flex justify-between"
          >
            {isLoading ? (
              <div className="h-11 w-full max-w-xs rounded-lg border border-foreground/10 bg-foreground/5 p-3 focus:outline-none focus:ring-0">
                <Skeleton className="h-full w-full rounded-sm" />
              </div>
            ) : (
              <Input
                disabled={!canEdit}
                autoFocus
                placeholder="filename"
                wrapperStyle="max-w-xs"
                className={form.values.name.length > 0 ? 'pl-0' : 'pl-2'}
                leftSection={
                  <div className="pl-2">
                    .env{form.values.name.length > 0 ? '.' : ''}
                  </div>
                }
                {...form.getInputProps('name')}
              />
            )}
            {(initialLoading || documentId) && (
              <>
                {isLoading ? (
                  <TeamAvatars loading />
                ) : (
                  <TeamDialog
                    project={project}
                    documentId={documentId}
                    title={form.values.name}
                    team={data?.team.members ?? []}
                    canEdit={userRole === MemberRole.Owner}
                  />
                )}
              </>
            )}
          </div>

          <div aria-label="Text area container" className="relative">
            {isLoading ? (
              <div className="flex h-[calc(40px+((16-1)*24px))] w-full flex-col gap-2 rounded-lg border border-foreground/10 bg-foreground/5 p-3">
                <Skeleton className="h-5 w-[60%] rounded-sm" />
                <Skeleton className="h-5 w-[50%] rounded-sm" />
                <Skeleton className="h-5 w-[70%] rounded-sm" />
                <Skeleton className="h-5 w-[40%] rounded-sm" />
                <Skeleton className="h-5 w-[50%] rounded-sm" />
              </div>
            ) : (
              <>
                <Textarea
                  disabled={!canEdit}
                  placeholder="Your secrets go here"
                  rows={16}
                  focusAction={() => setIsFocused(true)}
                  blurAction={() => setIsFocused(false)}
                  {...form.getInputProps('content')}
                />
                <TooltipProvider>
                  <div className="absolute right-0 top-0 m-2 flex flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ActionIcon
                          onClick={handleCopy}
                          className={
                            !isFocused
                              ? 'scale-100 opacity-100'
                              : 'scale-50 opacity-0 delay-100'
                          }
                        >
                          {clipboard.copied ? (
                            <Icons.check
                              size={18}
                              className="text-success animate-in fade-in-50 zoom-in"
                            />
                          ) : (
                            <Icons.copy
                              size={18}
                              className="text-foreground animate-in fade-in-50 zoom-in"
                            />
                          )}
                        </ActionIcon>
                      </TooltipTrigger>
                      <TooltipContent side="right">Copy</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ActionIcon
                          onClick={handleDownload}
                          className={
                            !isFocused
                              ? 'scale-100 opacity-100 delay-100'
                              : 'scale-50 opacity-0'
                          }
                        >
                          {download.complete ? (
                            <Icons.check
                              size={18}
                              className="text-success animate-in fade-in-50 zoom-in"
                            />
                          ) : (
                            <Icons.file
                              size={18}
                              className="text-foreground animate-in fade-in-50 zoom-in"
                            />
                          )}
                        </ActionIcon>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Download file
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </>
            )}
          </div>
          <DialogFooter>
            {(documentId || initialLoading) && (
              <div className="flex grow flex-col">
                <span className="text-sm text-muted-foreground">
                  Last update
                </span>
                {isLoading ? (
                  <Skeleton className="mt-1 h-4 w-40" />
                ) : (
                  <div>
                    {updatedDate} by{' '}
                    <span className="font-medium">
                      {data?.updated_by?.username}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Button
              disabled={isPending || isLoading}
              onClick={onClose}
              variant="subtle"
            >
              Discard
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!canEdit || !form.isDirty() || isLoading}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
