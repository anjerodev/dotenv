'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, zodResolver } from '@mantine/form'

import { projectSchema } from '@/lib/validations/project'
import { useProjects } from '@/hooks/useProjects'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/icons'
import { ProjectCard } from '@/components/project-card'

export function Projects() {
  const router = useRouter()
  const params = useSearchParams()
  const search = params.get('search') ?? ''
  const [open, setOpen] = useState(false)
  const { data, isLoading, create, isPending } = useProjects()

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: zodResolver(projectSchema),
  })

  const handleSubmit = async (values: { name: string }) => {
    try {
      await create(values)
      setOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      console.log({ error })
    }
  }

  const userProjects = data ?? []

  return (
    <CardsContainer>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card disabled={isLoading}>
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
                onClick={() => setOpen(false)}
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
      {isLoading ? (
        <Loading />
      ) : (
        userProjects
          .filter((project) =>
            project.name
              .toLocaleLowerCase()
              .includes(search.trim().toLocaleLowerCase())
          )
          .map((project) => <ProjectCard key={project.id} project={project} />)
      )}
    </CardsContainer>
  )
}

const Loading = () => (
  <>
    {new Array(2).fill('').map((_, idx) => (
      <Skeleton
        key={`projects-item-${idx}`}
        className="h-44 w-full rounded-2xl"
      />
    ))}
  </>
)
