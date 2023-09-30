'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

const PrimitiveSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    {
      children,
      className,
      orientation = 'horizontal',
      decorative = true,
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-foreground/20',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
)
PrimitiveSeparator.displayName = SeparatorPrimitive.Root.displayName

const Separator = ({
  children,
  orientation = 'horizontal',
  ...other
}: {
  children?: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}) => {
  if (children)
    return (
      <div className="flex items-center">
        <PrimitiveSeparator orientation={orientation} {...other} />
        <span className="mx-6">{children}</span>
        <PrimitiveSeparator orientation={orientation} {...other} />
      </div>
    )

  return <PrimitiveSeparator orientation={orientation} {...other} />
}

export { Separator }
