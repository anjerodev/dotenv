'use client'

import { useState } from 'react'
import { useForm, zodResolver } from '@mantine/form'

import { createProject } from '@/lib/mutations/project'
import { projectNameSchema } from '@/lib/validations/project'
import { useServerMutation } from '@/hooks/useServerMutation'
import { Button } from '@/components/ui/button'
import { Card, CardsContainer } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

interface ProjectsContainerProps {
  disabled?: boolean
  children: React.ReactNode
}

export function ProjectsContainer({
  children,
  disabled,
}: ProjectsContainerProps) {
  const [newOpen, setNewOpen] = useState(false)
  const [mutate, { isPending }] = useServerMutation()

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: zodResolver(projectNameSchema),
  })

  const handleSubmit = (values: { name: string }) => {
    mutate({
      mutation: createProject(values),
      onError: (error) => console.log({ error }),
      onSuccess: () => {
        setNewOpen(false)
        form.reset()
      },
    })
  }

  return (
    <CardsContainer>
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogTrigger asChild>
          <Card disabled={disabled}>
            <div className="flex grow flex-col items-center justify-center gap-2 font-semibold text-card-foreground">
              <Icons.plus size={32} />
              Add project
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="mt-4 grid grid-cols-1 gap-4"
          >
            <Input placeholder="Project name" {...form.getInputProps('name')} />
            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={() => setNewOpen(false)}
                variant="subtle"
              >
                Discard
              </Button>
              <Button loading={isPending} type="submit">
                {isPending ? 'Creating' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {children}
    </CardsContainer>
  )
}
