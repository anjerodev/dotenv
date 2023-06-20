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
          'bg-brand-500 text-brand-950 hover:bg-brand-600',
        destructive:
          'bg-red-500 text-zinc-900 hover:bg-red-600',
        outline:
          'bg-transparent border border-foreground/10 hover:bg-foreground/5',
        subtle:
          'bg-brand-500/10 text-brand-500 hover:bg-brand-500/20',
        ghost:
          'bg-transparent text-zinc-100 hover:bg-zinc-800',
        link: 'font-normal min-w-0 px-0 bg-transparent text-foreground hover:bg-transparent hover:text-accent',
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
