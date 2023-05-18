'use client'

import { useEffect, useReducer } from 'react'
import { isNotEmpty, useForm } from '@mantine/form'
import { Check, CheckCheck, Globe, Hand, User, X } from 'lucide-react'

import { Profile } from '@/types/collections'
import { ActionIcon } from '@/components/ui/action-icon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/providers/toast-provider'

import AvatarInput from './avatar-input'

type State = {
  saving: null | 'username' | 'website'
  email: string | null | undefined
  alert: boolean
  error: any
}

const initialState: State = {
  saving: null,
  email: null,
  alert: false,
  error: null,
}

interface FormValues {
  username: Profile['username']
  website: Profile['website']
}

function isValidURL(url: string | null) {
  try {
    if (!url) return true
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export default function UserInfo() {
  const { supabase } = useSupabase()
  const { user, isLoading } = useAuth()
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    initialState
  )

  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      website: '',
    },
    validate: {
      username: isNotEmpty(
        "You're not a ninja, so you can't leave the username field blank."
      ),
      website: (value) =>
        isValidURL(value)
          ? null
          : "Aaaand... that's not a website URL. We need something like 'https://example.com' to continue. Can you give us a hand here?",
    },
  })

  const usernameHasError = Object.keys(form.errors).includes('username')
  const websiteHasError = Object.keys(form.errors).includes('website')

  useEffect(() => {
    if (user && !user?.username) {
      setState({ alert: true })
    }
    form.setValues({
      username: user?.username ?? '',
      website: user?.website ?? '',
    })
    form.resetDirty({
      username: user?.username ?? '',
      website: user?.website ?? '',
    })
  }, [user?.username, user?.website])

  const updateUserName = async ({ username }: FormValues) => {
    try {
      if (!user || !username) return
      setState({ saving: 'username' })

      const updates = {
        id: user.id,
        username,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error

      toast.success('Profile update', {
        description:
          "Congratulations, you've successfully renamed yourself! Your new username is good to go. 🎉",
      })
      form.resetDirty({
        username,
        website: user?.website ?? '',
      })
      setState({ alert: false })
    } catch (error) {
      // console.log({ error })
      toast.error('Error', {
        description: 'Error saving change in your profile.',
      })
    } finally {
      setState({ saving: null })
    }
  }

  const updateWebsite = async ({ website }: FormValues) => {
    try {
      if (!user || !website) return

      setState({ saving: 'website' })

      const updates = {
        id: user.id,
        website,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error

      toast.success('Profile update', {
        description:
          'Ta-da! Your website field has been successfully updated. Give yourself a high five!🤚',
      })
      form.resetDirty({
        username: user?.username,
        website,
      })
    } catch (error) {
      // console.log({ error })
      toast.error('Error', {
        description: 'Error saving change in your profile.',
      })
    } finally {
      setState({ saving: null })
    }
  }

  const handleKeyDown = (key: string, id: 'username' | 'website') => {
    const prevValue = user?.[id]
    switch (key) {
      case 'Escape':
        if (prevValue && form.values[id] !== prevValue) {
          form.setFieldValue(id, prevValue)
        }
        break
      default:
        break
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      {state.alert && (
        <Alert className="mb-6" variant="warning">
          <Hand className="h-4 w-4" />
          <AlertTitle>Hold on a sec!</AlertTitle>
          <AlertDescription>
            {
              "We can't let you in without an username. And if you add an avatar, you'll be an unstoppable force."
            }
          </AlertDescription>
        </Alert>
      )}
      <AvatarInput
        uid={user?.id}
        avatar={user?.avatar ?? undefined}
        username={user?.username ?? undefined}
      />

      <div className="mb-8 mt-10 w-full text-center font-semibold">
        {isLoading ? (
          <Skeleton className="mx-auto h-[16px] w-[70%] rounded-md" />
        ) : (
          user?.email
        )}
      </div>
      <div className="grid max-w-[290px] grid-cols-1 gap-6">
        <form onSubmit={form.onSubmit(updateUserName)}>
          <Input
            placeholder="username"
            disabled={isLoading || state.saving === 'username'}
            onKeyDown={(event) => handleKeyDown(event.key, 'username')}
            leftSection={
              <div className="pl-1 text-muted-foreground">
                <User />
              </div>
            }
            rightSection={
              <ActionIcon
                type="submit"
                loading={state.saving === 'username'}
                disabled={
                  !form.isDirty('username') ||
                  state.saving === 'username' ||
                  isLoading
                }
              >
                {form.isValid('username') && !form.isDirty('username') && (
                  <CheckCheck size={18} className="text-succed" />
                )}
                {usernameHasError && <X size={18} className="text-error" />}

                <Check size={18} />
              </ActionIcon>
            }
            {...form.getInputProps('username')}
          />
        </form>
        <form onSubmit={form.onSubmit(updateWebsite)}>
          <Input
            placeholder="website"
            disabled={isLoading || state.saving === 'website'}
            onKeyDown={(event) => handleKeyDown(event.key, 'website')}
            leftSection={
              <div className="pl-1 text-muted-foreground">
                <Globe />
              </div>
            }
            rightSection={
              <ActionIcon
                type="submit"
                loading={state.saving === 'website'}
                disabled={
                  !form.isDirty('website') ||
                  state.saving === 'website' ||
                  isLoading
                }
              >
                {user?.website && !form.isDirty('website') && (
                  <CheckCheck size={18} className="text-succed" />
                )}
                {websiteHasError && <X size={18} className="text-error" />}

                <Check size={18} />
              </ActionIcon>
            }
            {...form.getInputProps('website')}
          />
        </form>
      </div>
    </div>
  )
}
