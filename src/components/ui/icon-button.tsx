import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'
import { UnstyledButton } from '@/components/ui/unstyled-button'

const iconButtonVariants = cva(
  'transition-all active:scale-95 flex inline-flex items-center justify-center rounded-full focus:outline-none disabled:opacity-50 disabled:pointer-events-none shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-gray-900 hover:bg-brand-600',
        contrast:
          'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-300',
      },
      size: {
        default: 'p-4',
        sm: 'p-2',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type IconButtonProps = {
  loading?: boolean
  icon: React.ReactNode
}

interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants>,
    IconButtonProps {
  component?: any
}

const _IconButton = React.forwardRef<HTMLButtonElement, ComponentProps>(
  (props, ref) => {
    const {
      component = 'button',
      className,
      variant,
      disabled,
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
          iconButtonVariants({ variant, size, className }),
          component !== 'button' &&
            isDisabled &&
            'pointer-events-none opacity-50'
        )}
        ref={ref}
        type={component === 'button' ? 'button' : undefined}
        disabled={isDisabled}
        {...other}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      </UnstyledButton>
    )
  }
)
_IconButton.displayName = 'IconButton'

const IconButton = createPolymorphicComponent<'button', ComponentProps>(
  _IconButton
)

export { IconButton, iconButtonVariants }
