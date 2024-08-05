import { useEffect, useReducer, useTransition } from 'react'

import { MutationError, MutationReturnType } from '@/types/actions'

interface Mutation {
  mutation: Promise<MutationReturnType>
  onError?: (error: MutationError) => void
  onSuccess?: () => void
}

/**
 * Set up a "done" state is necesary to execute any action after transition is complete.
 * Otherwise, onSuccess or onError will be fired before isPending is false.
 */

type State = {
  error: MutationReturnType['error']
  done: boolean
  onError?: (error: MutationError) => void
  onSuccess?: () => void
}

const initialState: State = {
  error: null,
  done: false,
  onError: undefined,
  onSuccess: undefined,
}

export function useServerMutation() {
  let [isPending, startTransition] = useTransition()
  const [state, setState] = useReducer(
    (prevState: State, newState: Partial<State>): State => ({
      ...prevState,
      ...newState,
    }),
    initialState
  )

  useEffect(() => {
    if (!isPending && state.done && !state.error) {
      state.onSuccess && state.onSuccess()
    }
    if (!isPending && state.done && state.error) {
      state.onError && state.onError(state.error)
    }
  }, [isPending, state.done, state.error])

  const mutate = ({ mutation, onError, onSuccess }: Mutation) => {
    setState({ onError, onSuccess })
    startTransition(async () => {
      const { error } = await mutation
      setState({ error, done: true })
    })
  }

  return [
    mutate,
    {
      isPending,
      isDone: !isPending && state.done,
      error: state.error,
    },
  ] as const
}
