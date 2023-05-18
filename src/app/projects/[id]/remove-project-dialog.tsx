'use client'

import { useForm } from '@mantine/form'
import { DialogProps } from '@radix-ui/react-dialog'

import { Project } from '@/types/collections'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface DialogPropsType extends DialogProps {
  project: Project
  onSucced?: () => void
}

export default function RemoveProjectDialog({
  project,
  onSucced,
  ...other
}: DialogPropsType) {
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: (values) => ({
      name:
        values.name !== project.name
          ? 'We’re sorry, you didn’t pass the alcohol test. Please come back after some rest.'
          : null,
    }),
  })

  const handleSubmit = ({ name }: { name: string }) => {
    if (name === project.name && onSucced) onSucced()
  }

  return (
    <Dialog {...other}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Remove project</DialogTitle>
          <DialogDescription>
            {'Deleting the '}
            <span className="font-bold italic">{project.name}</span>{' '}
            {
              " project is a one-way trip, there's no coming back, and everything in the project will be lost."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="grid gap-3 py-4">
            {
              'We just want to check you’re not drunk. Please enter the project name in the field below to confirm.'
            }
            <Input placeholder="Project name" {...form.getInputProps('name')} />
          </div>
          <DialogFooter>
            <Button fullWidth variant="destructive" type="submit">
              Remove project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
