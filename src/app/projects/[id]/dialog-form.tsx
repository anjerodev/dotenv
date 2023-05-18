'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Check, Copy, FileJson } from 'lucide-react'

import { MemberRole } from '@/types/collections'
import { cn } from '@/lib/cn'
import { useClipboard } from '@/hooks/useClipboard'
import useDocument from '@/hooks/useDocument'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import { ActionIcon } from '@/components/ui/action-icon'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { toast } from '@/components/providers/toast-provider'

import TeamDialog from './team-dialog'

dayjs.extend(utc)
dayjs.extend(timezone)

type FormType = {
  name: string
  content: string
}

type State = {
  loading: boolean
}

const initialState = {
  loading: false,
}

export default function DialogForm({
  projectId,
  projectName,
  documentId,
  onClose,
}: {
  projectId: string
  projectName: string
  documentId?: string
  onClose?: () => void
}) {
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    initialState
  )

  const [focused, setFocused] = useState(false)
  const { user } = useAuth()
  const clipboard = useClipboard()
  const download = useDownloadFile({ format: 'env' })
  const { data, addDocument, updateDocument, isLoading } = useDocument({
    projectId,
    documentId,
  })

  const form = useForm({
    initialValues: {
      name: '',
      content: '',
    },
    transformValues: (values) => ({
      name: `.env${values.name ? '.' + values.name : ''}`,
      content: values.content,
    }),
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        name: data?.name ? data.name.replace(/\.env\.?/g, '') : '',
        content: data?.content ?? '',
      })
      form.resetDirty({
        name: data?.name ? data.name.replace(/\.env\.?/g, '') : '',
        content: data?.content ?? '',
      })
    }
  }, [data])

  const handleCopy = () => {
    clipboard.copy(form.values.content)
  }

  const handleDownload = () => {
    const values = form.getTransformedValues()
    download.download({
      data: values.content,
      filename: projectName + values.name,
    })
  }

  const handleSubmit = async (values: FormType) => {
    setState({ loading: true })

    try {
      if (data) {
        // Is updating
        // If the name does not change we pass it as null avoid check documents with the same name within the project
        const newName = values.name !== data.name ? values.name : null
        await updateDocument({
          name: newName,
          content: values.content,
        })
      } else {
        // Is creating
        await addDocument({
          name: values.name,
          content: values.content,
        })
        form.reset()
        onClose && onClose()
      }
    } catch (error: any) {
      const errorMessages = error?.form
      if (errorMessages) {
        form.setErrors({ ...form.errors, ...errorMessages })
      } else {
        toast.error('Error submiting form.', { description: error.message })
      }
    } finally {
      setState({ loading: false })
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

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="grid grid-cols-1 gap-3"
    >
      <div className="flex justify-between">
        {isLoading ? (
          <div className="h-11 w-full max-w-xs rounded-lg border bg-foreground/5 p-3">
            <Skeleton className="h-full w-full rounded-sm" />
          </div>
        ) : (
          <Input
            disabled={!canEdit}
            placeholder="filename"
            wraperStyle="max-w-xs"
            className={form.values.name.length > 0 ? 'pl-0' : 'pl-2'}
            leftSection={
              <div className="pl-2">
                .env{form.values.name.length > 0 ? '.' : ''}
              </div>
            }
            {...form.getInputProps('name')}
          />
        )}
        {documentId && (
          <>
            {isLoading || !data?.team ? (
              <div className="flex items-center justify-end">
                {new Array(3).fill('').map((_, index) => (
                  <div key={index} className="-ml-2 rounded-full bg-background">
                    <Skeleton className="m-[3px] h-[34px] w-[34px] animate-skeleton-pulse rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <TeamDialog
                title={form.values.name}
                team={data?.team.members}
                canEdit={userRole === MemberRole.Owner}
              />
            )}
          </>
        )}
      </div>

      <div className="relative">
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
              focusAction={() => setFocused(true)}
              blurAction={() => setFocused(false)}
              {...form.getInputProps('content')}
            />
            <TooltipProvider>
              <div className="absolute right-0 top-0 m-2 flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ActionIcon
                      onClick={handleCopy}
                      className={cn(
                        'bg-white transition-all',
                        !focused
                          ? 'scale-100 opacity-100'
                          : 'scale-50 opacity-0 delay-100'
                      )}
                    >
                      {clipboard.copied ? (
                        <Check
                          size={18}
                          className="text-[#3CA988] animate-in fade-in-50 zoom-in"
                        />
                      ) : (
                        <Copy
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
                      className={cn(
                        'bg-white transition-all',
                        !focused
                          ? 'scale-100 opacity-100 delay-100'
                          : 'scale-50 opacity-0'
                      )}
                    >
                      {download.complete ? (
                        <Check
                          size={18}
                          className="text-[#3CA988] animate-in fade-in-50 zoom-in"
                        />
                      ) : (
                        <FileJson
                          size={18}
                          className="text-foreground animate-in fade-in-50 zoom-in"
                        />
                      )}
                    </ActionIcon>
                  </TooltipTrigger>
                  <TooltipContent side="right">Download file</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </>
        )}
      </div>
      <DialogFooter>
        {documentId && (
          <div className="flex grow flex-col">
            <span className="text-sm text-muted-foreground">Last update</span>
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
          disabled={state.loading || isLoading}
          onClick={onClose}
          variant="subtle"
        >
          Discard
        </Button>
        <Button
          type="submit"
          loading={state.loading}
          disabled={!canEdit || !form.isDirty() || isLoading}
        >
          {state.loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}
