'use client'

import { useEffect, useState } from 'react'

import {
  Member,
  MemberRole,
  Profile,
  ProjectType,
  membersActions,
} from '@/types/collections'
import { capitalize } from '@/lib/helpers'
import { useDebounce } from '@/hooks/useDebounce'
import { useMembers } from '@/hooks/useMembers'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { UnstyledButton } from '@/components/ui/unstyled-button'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import TeamAvatars from '@/components/team-avatars'
import UserAvatar from '@/components/user-avatar'

import { RoleSelector, roleSelectorOptions } from './role-selector'
import { Avatar, AvatarImage } from './ui/avatar'
import { Skeleton } from './ui/skeleton'

type DialogProps = {
  project: ProjectType
  documentId: string | null
  title: string
  team: Member[]
  canEdit: boolean
  disabled?: boolean
}

export default function TeamDialog({
  project,
  documentId,
  title,
  team,
  canEdit,
  disabled,
}: DialogProps) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] =
    useState<Partial<Member & { action?: membersActions }>[]>(team)
  const { loading, fetch, update, isPending } = useMembers()
  const [searchUsers, setSearchUsers] = useState<Partial<Profile>[]>([])
  const { user } = useAuth()
  const [value, setValue] = useDebounce('', 1000)

  const handleSubmit = () => {
    if (!canEdit || !documentId) return
    const updatedMembers = members
      .filter((m) => m?.action)
      .map((m) => ({ ref: m.ref, id: m.id, role: m.role, action: m.action }))
    update({ projectId: project.id, documentId, members: updatedMembers })
      .then(() => {
        setOpen(false)
      })
      .catch((error) => {
        console.log({ error })
        // TODO: Handle Error
      })
  }

  const addMember = (value: Member) => {
    const index = members.findIndex((member) => member.id === value.id)
    if (index !== -1) {
      const memberAction = members[index]?.action
      if (memberAction && memberAction === membersActions.REMOVE) {
        return setMembers((prev) => {
          const newMembers = [...prev]
          newMembers.splice(index, 1, {
            ...prev[index],
            action: membersActions.CREATE,
          })
          return newMembers
        })
      }
      return
    }
    return setMembers((prev) => [
      ...prev,
      { ...value, role: MemberRole.Editor, action: membersActions.CREATE },
    ])
  }

  const fetchUsers = async () => {
    const searchUsers = await fetch({ username: value, email: value })
    setSearchUsers(searchUsers)
  }

  useEffect(() => {
    if (value) {
      fetchUsers()
    }
  }, [value])

  const handleSearch = async (value: string) => {
    setValue(value)
    if (!value) setSearchUsers([])
  }

  const handleSelectValueChange = (id: string, value: string) => {
    const isOnTeam = Boolean(team.find((m) => m.id === id))

    /**
     * If the new member has been added and removed in the same
     * edition, just remove it from the current members state list
     */
    if (!isOnTeam && value === 'remove') {
      return setMembers(members.filter((m) => m.id !== id))
    }

    const newMembers = members.map((member) => {
      if (member.id === id) {
        if (value === 'remove') {
          return {
            ...member,
            action: membersActions.REMOVE,
          }
        }

        const action = isOnTeam ? membersActions.UPDATE : membersActions.CREATE
        return {
          ...member,
          role: value as MemberRole,
          action,
        }
      }
      return member
    })

    setMembers(newMembers)
  }

  const currentUserIsOwner =
    members.find((m) => m.id === user?.id)?.role === MemberRole.Owner

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled} asChild>
        <UnstyledButton className="flex h-fit rounded-full transition focus:scale-95 focus:outline-none">
          <TeamAvatars team={team} maxAvatars={5} />
        </UnstyledButton>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        closeButton={false}
        className="w-full sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{'.env' + title}</DialogTitle>
        </DialogHeader>
        <div className="mb-4 mt-2 flex items-center gap-3">
          <SearchableSelect
            onChange={handleSearch}
            options={searchUsers}
            onItemSelected={addMember}
            disabled={!canEdit}
            loading={loading}
            placeholder="Email or username"
            labelKey="email"
            valueKey="id"
            itemComponent={(option) => (
              <div className="flex items-center gap-4">
                <Avatar size="xs">
                  <AvatarImage src={option.avatar} />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base">{option.username}</span>
                </div>
              </div>
            )}
            loadingComponent={new Array(3).fill('').map((_, index) => (
              <div
                key={index}
                className="mb-1 flex w-full items-center gap-4 p-1"
              >
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex grow flex-col">
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </div>
            ))}
          />
        </div>
        <div className="mb-2 text-muted-foreground">Members with access</div>
        {members.map((member) => {
          const isCurrentUer = member.id === user?.id
          const isOwner = member.role === MemberRole.Owner

          return (
            <div key={member.id} className="flex justify-between py-1">
              <div className="flex items-center gap-3">
                <UserAvatar
                  avatar={member.avatar ?? ''}
                  username={member.username ?? ''}
                />
                {`${member.username} ${isCurrentUer ? '(you)' : ''}`}
              </div>
              {isOwner
                ? capitalize(member.role!)
                : (currentUserIsOwner || isCurrentUer) && (
                    <RoleSelector
                      disabled={!canEdit}
                      options={roleSelectorOptions}
                      value={
                        member.action === 'remove' ? 'remove' : member.role
                      }
                      onChange={(value) =>
                        handleSelectValueChange(member.id!, value)
                      }
                    />
                  )}
            </div>
          )
        })}
        <DialogFooter className="mt-6">
          <Button
            disabled={isPending}
            onClick={() => setOpen(false)}
            variant="subtle"
          >
            Discard
          </Button>
          <Button
            disabled={!canEdit}
            onClick={handleSubmit}
            loading={isPending}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
