'use client'

import { useState, useTransition } from 'react'
import { isNotEmpty, useForm } from '@mantine/form'
import { Plus } from 'lucide-react'

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

import { createProject } from './actions'

export default function ProjectsContainer({
  children,
  disabled
}: {
  children?: React.ReactNode,
  disabled?: boolean
}) {
  let [isPending, startTransition] = useTransition()
  const [newOpen, setNewOpen] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: isNotEmpty(''),
    },
  })

  const handleSubmit = (values: { name: string }) => {
    startTransition(async () => {
      await createProject(values)
      form.reset
      setNewOpen(false)
    })
  }

  return (
    <>
      <CardsContainer>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger asChild>
            <Card disabled={disabled}>
              <div className="flex grow flex-col items-center justify-center gap-2 font-semibold text-card-foreground">
                <Plus size={32} />
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
              <Input
                placeholder="Project name"
                {...form.getInputProps('name')}
              />
              <DialogFooter>
                <Button
                  disabled={isPending}
                  onClick={() => setNewOpen(false)}
                  variant="subtle"
                >
                  Discard
                </Button>
                <Button loading={isPending} type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {children}
      </CardsContainer>
    </>
  )
}
