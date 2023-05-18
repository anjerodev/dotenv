'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'

import { Member, MemberRole } from '@/types/collections'
import { capitalize } from '@/lib/capitalize'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { UnstyledButton } from '@/components/ui/unstyled-button'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import TeamAvatars from '@/components/team-avatars'
import UserAvatar from '@/components/user-avatar'

import {
  RoleSelector,
  extraRoleOptions,
  roleSelectorOptions,
} from './role-selector'

type DialogProps = {
  title: string
  team: Member[]
  canEdit: boolean
  disabled?: boolean
}

export default function TeamDialog({
  title,
  team,
  canEdit,
  disabled,
}: DialogProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const handleSubmit = () => {
    if (!canEdit) return
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled} asChild>
        <UnstyledButton className="flex h-fit">
          <TeamAvatars team={team} maxAvatars={5} />
        </UnstyledButton>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        closeButton={false}
        className="w-full sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{'.env' + title}</DialogTitle>
        </DialogHeader>
        <div className="mb-1 mt-2 flex items-center gap-3">
          <Input
            disabled={!canEdit}
            className="grow"
            placeholder="Email or username"
            type="search"
            leftSection={
              <div className="pl-1 text-muted-foreground">
                <Search size={18} />
              </div>
            }
          />
          <RoleSelector disabled={!canEdit} options={roleSelectorOptions} />
          <Button
            disabled={!canEdit}
            className="h-[45px]"
            variant="outline"
            icon={<Plus size={20} />}
          >
            Add
          </Button>
        </div>
        <div className="mb-1">Members with access</div>
        {team.map((member) => (
          <div key={member.id} className="flex justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar
                avatar={member.avatar ?? ''}
                username={member.username ?? ''}
              />
              {`${member.username} ${member.id === user?.id ? '(you)' : ''}`}
            </div>
            {member.role === MemberRole.Owner ? (
              capitalize(member.role)
            ) : (
              <RoleSelector
                disabled={!canEdit}
                options={[...roleSelectorOptions, ...extraRoleOptions]}
                value={member.role}
              />
            )}
          </div>
        ))}
        <DialogFooter className="mt-6">
          <Button onClick={() => setOpen(false)} variant="subtle">
            Discard
          </Button>
          <Button disabled={!canEdit} onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
