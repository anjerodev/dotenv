import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'

import { DefaultProps } from '@/types/styles'
import { cn } from '@/lib/cn'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'
import { UnstyledButton } from '@/components/ui/unstyled-button'
import { Icons } from '@/components/icons'

const actionIconVariants = cva(
  'transition-all active:scale-[97%] flex inline-flex items-center justify-center rounded-md outline-none ring-ring disabled:opacity-80 disabled:pointer-events-none ring-0 focus-visible:ring-2 focus-visible:ring-offset-0 dark:ring-offset-zinc-800',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-foreground hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-950/50',
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
  component?: any
}

const _ActionIcon = React.forwardRef<HTMLButtonElement, ActionIconProps>(
  (props, ref) => {
    const {
      component = 'button',
      children,
      className,
      variant,
      disabled,
      size,
      loading,
      ...other
    } = props

    const isDisabled = disabled || loading
    const childrenArray = React.Children.toArray(children)
    const firstChild = childrenArray[0]

    return (
      <UnstyledButton
        component={component}
        className={cn(
          actionIconVariants({ variant, size, className }),
          component !== 'button' &&
            isDisabled &&
            'pointer-events-none opacity-50'
        )}
        ref={ref}
        type={component === 'button' ? 'button' : undefined}
        disabled={isDisabled}
        {...other}
      >
        {loading ? (
          <Icons.spinner className="h-[18px] w-[18px] animate-spin" />
        ) : (
          firstChild
        )}
      </UnstyledButton>
    )
  }
)
_ActionIcon.displayName = 'ActionIcon'

const ActionIcon = createPolymorphicComponent<'button', ActionIconProps>(
  _ActionIcon
)

export { ActionIcon, actionIconVariants }
