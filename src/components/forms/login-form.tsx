'use client'

import { useReducer } from 'react'
import { isEmail, useForm } from '@mantine/form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmailInput } from '@/components/forms/email-input'
import { Icons } from '@/components/icons'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { toast } from '@/components/providers/toast-provider'

type State = {
  submited: boolean
  error: any
  provider: string | null
}

const initialState: State = {
  submited: false,
  error: null,
  provider: null,
}

const providers = {
  GITHUB: 'github',
  MAGIC_LINK: 'magic',
}

export function LoginForm() {
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    initialState
  )
  const { signInWithOtp, signInWithGithub, isAuthenticating } = useAuth()

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail(
        "That email looks like a chicken trying to type on a keyboard. Let's try again with a real email, shall we?"
      ),
    },
    initialErrors: {
      email: null,
    },
  })

  const handleSubmit = async ({ email }: { email: string }) => {
    if (form.validate().hasErrors) return
    setState({ provider: providers.MAGIC_LINK })

    const error = await signInWithOtp(email)

    if (error) {
      console.log({ error })
      setState({ error })
      toast.error('Error', {
        description:
          "Oops, looks like your login attempt went astray. Let's try again and get you in this time!",
      })
    } else {
      setState({ submited: true, error: null })
    }
  }

  const hanldleGitHubLogin = async () => {
    const error = await signInWithGithub()
    setState({ provider: providers.GITHUB })

    if (error) {
      console.log({ error })
      setState({ error })
      toast.error('Error', {
        description:
          "Oops, looks like your login attempt went astray. Let's try again and get you in this time!",
      })
    } else {
      setState({ error: null })
    }
  }

  const errors = form.errors

  return (
    <>
      {/* Email Input */}
      <form className="mt-12" onSubmit={form.onSubmit(handleSubmit)}>
        <EmailInput
          disabled={isAuthenticating || state.submited}
          error={errors.email}
          onChange={(value) => form.setFieldValue('email', value)}
        />
        <Button
          loading={isAuthenticating && state.provider === providers.MAGIC_LINK}
          disabled={isAuthenticating || state.submited}
          icon={<Icons.wand size={16} />}
          variant="default"
          type="submit"
          className="mt-6 w-full"
        >
          Login with Magic Link
        </Button>
      </form>

      {state.submited && (
        <div className="mt-4">
          <p className="text-center">
            {
              "Check your inbox! We've just sent you a golden ticket to sign in. \nDon't let it go to waste!"
            }
          </p>
        </div>
      )}

      {/* Seperator */}
      <div className="my-8">
        <Separator>or</Separator>
      </div>

      {/* Github Button */}
      <Button
        disabled={isAuthenticating || state.submited}
        loading={isAuthenticating && state.provider === providers.GITHUB}
        onClick={hanldleGitHubLogin}
        icon={<Icons.github size={16} />}
        className="w-full bg-gray-900 text-gray-100 hover:bg-gray-950 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
      >
        Login with Github
      </Button>
    </>
  )
}
