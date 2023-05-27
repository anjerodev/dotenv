import * as React from 'react'

import { cn } from '@/lib/cn'

type Props = {
  error?: string | null | React.ReactNode
  onChange?: (value: string) => void | null
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {}

export function EmailInput({
  error,
  value,
  disabled,
  onChange,
}: Props & InputProps) {
  return (
    <>
      {/* Inputs Container */}
      <div className="space-y-6">
        {/* Wrapper */}
        <div
          className={cn(
            "relative space-y-2 after:absolute after:inset-x-0 after:bottom-0 after:mx-auto after:h-1 after:w-0 after:rounded-sm after:bg-brand-500 after:opacity-50 after:transition-all after:content-[''] focus-within:after:w-full focus-within:after:opacity-100",
            error && 'after:w-full after:bg-red-500 after:opacity-100'
          )}
        >
          <input
            className={cn(
              'flex h-16 w-full rounded-md bg-transparent px-3 py-2 text-center text-3xl placeholder:text-muted-foreground  focus:outline-none focus:ring-0 focus:after:w-full disabled:cursor-not-allowed disabled:opacity-50',
              error && 'text-error',
              disabled && 'text-foreground/50'
            )}
            // type="email"
            value={value}
            placeholder="Enter your email"
            disabled={disabled}
            {...(onChange && { onChange: (e) => onChange(e.target.value) })}
          />
        </div>
      </div>
      {/* Error */}
      {error && <div className="mt-1 text-error">{error}</div>}
    </>
  )
}
