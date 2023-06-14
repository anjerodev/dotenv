import { RequestErrorType } from '@/lib/errors'

export interface MutationError extends Omit<RequestErrorType, 'status'> {}

export type MutationReturnType = {
  error?: MutationError | null
  data?: any
}
