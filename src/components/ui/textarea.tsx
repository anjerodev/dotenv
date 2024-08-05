'use client'

import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TextareaProps
  extends Partial<
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'>
  > {
  error?: string | undefined | null
  rows?: number
  wrapperStyle?: string
  scrollAreaStyle?: string
  focusAction?: () => void
  blurAction?: () => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const [focused, setFocused] = React.useState(false)
    const {
      rows = 5,
      error,
      wrapperStyle,
      scrollAreaStyle,
      className,
      focusAction,
      blurAction,
      ...other
    } = props

    const handleFocus = () => {
      setFocused(true)
      focusAction && focusAction()
    }

    const handleBlur = () => {
      setFocused(false)
      blurAction && blurAction()
    }

    return (
      <>
        <div
          className={cn(
            'relative flex w-full items-center rounded-lg border bg-foreground/5 p-1 text-foreground outline-none ring-ring ring-offset-background transition-all',
            focused ? 'ring-2 ring-offset-2' : 'ring-0',
            error ? 'border-error' : 'border-foreground/10',
            focused && error && 'ring-red-400/70',
            wrapperStyle
          )}
        >
          <ScrollArea
            className={cn(
              'flex w-full items-stretch justify-stretch rounded-lg',
              scrollAreaStyle
            )}
            style={{
              height: `${40 + (rows - 1) * 24}px`,
            }}
          >
            <TextareaAutosize
              ref={ref}
              className={cn(
                'flex h-full w-full grow resize-none overflow-hidden rounded-lg border-0 bg-transparent px-3 py-2 outline-none ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
              minRows={rows}
              {...other}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </ScrollArea>
        </div>

        {error && <div className="mt-2 text-sm text-error">{error}</div>}
      </>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
