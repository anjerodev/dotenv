'use client'

import { SWRConfig } from 'swr'

const options = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
}
export function SwrProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={options}>{children}</SWRConfig>
}
