import * as React from 'react'

import { DefaultProps } from '@/types/styles'
import { cn } from '@/lib/cn'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'

import { Polymorphic } from './polymorphic'

export interface UnstyledButtonProps extends DefaultProps {
  variant?: string
  children?: React.ReactNode
  component?: any
}

export const _UnstyledButton = React.forwardRef<
  HTMLDivElement,
  UnstyledButtonProps
>((props, ref) => {
  const { className, component = 'button', variant, ...others } = props

  return (
    <Polymorphic
      component={component}
      ref={ref}
      className={cn(className)}
      type={component === 'button' ? 'button' : undefined}
      {...others}
    />
  )
})

_UnstyledButton.displayName = 'UnstyledButton'

export const UnstyledButton = createPolymorphicComponent<
  'button',
  UnstyledButtonProps
>(_UnstyledButton)
