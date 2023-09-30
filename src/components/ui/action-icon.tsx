import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { DefaultProps } from '@/types/styles'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'
import { cn } from '@/lib/utils'
import { UnstyledButton } from '@/components/ui/unstyled-button'
import { Icons } from '@/components/icons'

const actionIconVariants = cva(
  'transition-all active:scale-90 hover:-translate-y-0.5 flex inline-flex items-center justify-center rounded-md outline-none ring-ring disabled:opacity-80 disabled:pointer-events-none ring-0 focus-visible:ring-2 focus-visible:ring-offset-0 ring-offset-background',
  {
    variants: {
      variant: {
        default: 'text-foreground bg-zinc-950',
      },
      size: {
        default: 'p-2',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ActionIconProps
  extends DefaultProps,
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionIconVariants> {
  loading?: boolean
  disabled?: boolean
}

const _ActionIcon = React.forwardRef<HTMLButtonElement, ActionIconProps>(
  (props, ref) => {
    const { children, className, variant, disabled, size, loading, ...other } =
      props

    const childrenArray = React.Children.toArray(children)
    const firstChild = childrenArray[0]

    return (
      <UnstyledButton
        className={cn(actionIconVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
        {...other}
      >
        {loading ? (
          <Icons.spinner className="h-6 w-6 animate-spin" />
        ) : (
          firstChild
        )}
      </UnstyledButton>
    )
  }
)
_ActionIcon.displayName = 'ActionIcon'

export const ActionIcon = createPolymorphicComponent<'button', ActionIconProps>(
  _ActionIcon
)
