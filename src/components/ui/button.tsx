import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'
import { UnstyledButton } from '@/components/ui/unstyled-button'
import { Icons } from '@/components/icons'

const buttonVariants = cva(
  'transition-all active:scale-[0.98] gap-2 min-w-[140px] flex inline-flex items-center justify-center rounded-lg text-md font-semibold disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      size: {
        default: 'h-12 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
      variant: {
        default:
          'bg-brand-600 text-brand-100 dark:bg-brand-500 dark:text-brand-950 hover:bg-brand-500 dark:font-bold dark:hover:bg-brand-600',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 dark:text-zinc-900 dark:hover:bg-red-600',
        outline:
          'bg-transparent border border-foreground/10 hover:bg-foreground/5',
        subtle:
          'bg-brand-500/25 text-brand-900 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:bg-brand-500/10 dark:text-brand-500',
        ghost:
          'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'font-normal min-w-0 px-0 bg-transparent dark:bg-transparent text-foreground hover:bg-transparent hover:text-accent dark:hover:bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type CustomProps = {
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    CustomProps {
  component?: any
}

const _Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      component = 'button',
      children,
      className,
      variant,
      disabled,
      fullWidth,
      size,
      loading,
      icon,
      ...other
    } = props
    const isDisabled = disabled || loading

    return (
      <UnstyledButton
        component={component}
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && 'w-full',
          component !== 'button' &&
            isDisabled &&
            'pointer-events-none opacity-50'
        )}
        ref={ref}
        type={component === 'button' ? 'button' : undefined}
        disabled={isDisabled}
        {...other}
      >
        {icon && !loading && icon}
        {loading && <Icons.spinner className="h-5 w-5 animate-spin" />}
        {children}
      </UnstyledButton>
    )
  }
)
_Button.displayName = 'Button'

const Button = createPolymorphicComponent<'button', ButtonProps>(_Button)

export { Button, buttonVariants }
