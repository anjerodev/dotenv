'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
      <h2>Oh no... there has been an error with this page.</h2>
      <div className="text-muted-foreground">{error?.message}</div>
    </div>
  )
}
