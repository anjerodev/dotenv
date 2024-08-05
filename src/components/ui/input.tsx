'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperStyle?: string
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
  error?: string | undefined | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      wrapperStyle,
      className,
      leftSection,
      rightSection,
      error,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)

    return (
      <div>
        <div
          className={cn(
            'relative flex h-11 w-full items-center rounded-lg border border-foreground/10 bg-foreground/5 p-1 text-foreground outline-none ring-0 ring-ring ring-offset-background transition-all',
            focused && 'ring-2 ring-offset-2',
            error && 'border-error text-error',
            focused && error && 'ring-error/70',
            wrapperStyle
          )}
        >
          <span
            className={cn(
              'relative flex text-muted-foreground',
              error && 'text-error'
            )}
          >
            {leftSection}
          </span>
          <input
            className={cn(
              'h-full w-full grow rounded-lg border-0 bg-transparent px-3 py-2 outline-none ring-0 transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
            onFocus={(event) => {
              setFocused(true)
            }}
            onBlur={(event) => {
              setFocused(false)
            }}
          />
          {rightSection}
        </div>
        {error && <div className="ml-1 mt-1 text-sm text-error">{error}</div>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
