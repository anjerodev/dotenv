import { RequestErrorType } from '@/lib/request-error-handler'

export interface MutationError extends Omit<RequestErrorType, 'status'> {}

export type MutationReturnType = {
  error: MutationError | null
}
