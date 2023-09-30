'use client'

import { useReducer } from 'react'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

import { DEBUG } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmailInput } from '@/components/forms/email-input'
import { Icons } from '@/components/icons'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { toast } from '@/components/providers/toast-provider'

type State = {
  submitted: boolean
  error: any
  provider: string | null
}

const initialState: State = {
  submitted: false,
  error: null,
  provider: null,
}

const providers = {
  GITHUB: 'github',
  MAGIC_LINK: 'magic',
}

const schema = z.object({
  email: z
    .string()
    .email({
      message:
        "That email looks like a chicken trying to type on a keyboard. Let's try again with a real email, shall we?",
    })
    .nonempty({
      message:
        "Are you trying to sign in without an email address? That's not going to work.",
    }),
})

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
    validate: zodResolver(schema),
    initialValues: {
      email: '',
    },
  })

  const handleSubmit = async ({ provider }: { provider: string }) => {
    setState({ provider })

    let error, submitted
    switch (provider) {
      case providers.MAGIC_LINK:
        if (form.validate().hasErrors) break
        const { error: otpError } = await signInWithOtp(form.values.email)
        error = otpError
        submitted = true
        break
      case providers.GITHUB:
        const { error: githubError } = await signInWithGithub()
        error = githubError
        break
      default:
        throw new Error('Unsupported provider')
    }

    if (error) {
      if (DEBUG) {
        console.log({ error })
      }

      setState({ error })

      toast.error('Error', {
        description:
          "Oops, looks like your login attempt went astray. Let's try again and get you in this time!",
      })
    } else {
      setState({ submitted, error: null })
    }
  }

  const errors = form.errors

  return (
    <>
      {/* Email Input */}
      <form
        className="mt-12"
        onSubmit={form.onSubmit(() =>
          handleSubmit({ provider: providers.MAGIC_LINK })
        )}
      >
        <EmailInput
          disabled={isAuthenticating || state.submitted}
          error={errors.email}
          onChange={(value) => form.setFieldValue('email', value)}
        />
        <Button
          loading={
            isAuthenticating &&
            state.provider === providers.MAGIC_LINK &&
            !state.submitted
          }
          disabled={isAuthenticating || state.submitted}
          icon={<Icons.wand size={16} />}
          variant="default"
          type="submit"
          className="mt-6 w-full"
        >
          Login with Magic Link
        </Button>
      </form>

      {state.submitted && (
        <div className="mt-4">
          <p className="text-center">
            {
              "Check your inbox! We've just sent you a golden ticket to sign in. \nDon't let it go to waste!"
            }
          </p>
        </div>
      )}

      {/* Separator */}
      <div className="my-8">
        <Separator>or</Separator>
      </div>

      {/* Github Button */}
      <Button
        disabled={isAuthenticating || state.submitted}
        loading={isAuthenticating && state.provider === providers.GITHUB}
        onClick={() => handleSubmit({ provider: providers.GITHUB })}
        icon={<Icons.github size={16} />}
        className="w-full bg-gray-100 text-gray-900 hover:bg-gray-300"
      >
        Login with Github
      </Button>
    </>
  )
}
