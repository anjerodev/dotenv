'use client'

import { useState } from 'react'
import { routes } from '@/constants/routes'
import { isNotEmpty, useForm } from '@mantine/form'
import { Plus, Search } from 'lucide-react'

import { Project } from '@/types/collections'
import useProjects from '@/hooks/useProjects'
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
import TeamAvatars from '@/components/team-avatars'

export default function ProjectsContent() {
  const [search, setSearch] = useState('')
  const [newOpen, setNewOpen] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: isNotEmpty(''),
    },
  })

  const handleSubmit = async ({ name }: { name: string }) => {
    setNewOpen(false)
  }

  return (
    <>
      <div className="mb-12 flex items-center justify-between">
        <div className="title">Your Projects</div>
        <div className="w-full max-w-xs">
          <Input
            placeholder="Search project..."
            leftSection={
              <div className="pl-1 text-muted-foreground">
                <Search size={18} />
              </div>
            }
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <CardsContainer>
          <DialogTrigger asChild>
            <Card>
              <div className="flex grow flex-col items-center justify-center gap-2 font-semibold text-card-foreground">
                <Plus size={32} />
                Add project
              </div>
            </Card>
          </DialogTrigger>

          <ProjectList search={search} />
        </CardsContainer>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Input placeholder="Project name" {...form.getInputProps('name')} />
          </form>
          <DialogFooter>
            <Button onClick={() => setNewOpen(false)} variant="subtle">
              Discard
            </Button>
            <Button onClick={() => handleSubmit(form.values)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const ProjectList = ({ search }: { search: string }) => {
  const { count, data: projects, isLoading } = useProjects()

  const searchResults = projects.filter((project: Project) =>
    project.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  ) as Project[]

  return (
    <>
      {/* Loading Cards */}
      {count &&
        isLoading &&
        new Array(count)
          .fill('')
          .map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
      {/* User projects */}
      {searchResults.map(({ id, documents, name, team }) => (
        <Card key={id} href={`${routes.PROJECTS}/${id}`}>
          <div className="mb-2 text-lg font-medium">{name}</div>
          {documents && documents.length === 0 && (
            <div className="italic text-zinc-400 dark:text-zinc-500">empty</div>
          )}
          {documents &&
            documents.length > 0 &&
            documents.slice(0, 3).map((doc) => (
              <div key={doc.id || doc.name} className="text-zinc-400">
                {doc.name}
              </div>
            ))}
          {documents && documents.length > 3 && <div>...</div>}
          <div className="absolute inset-x-0 bottom-0 flex justify-end px-6 py-4">
            <TeamAvatars team={team.members} />
          </div>
        </Card>
      ))}
    </>
  )
}
