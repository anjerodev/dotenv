import * as React from 'react'

import { DefaultProps } from '@/types/styles'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'

import { Polymorphic } from './polymorphic'

export interface UnstyledButtonProps extends DefaultProps {
  variant?: string
  children?: React.ReactNode
}

export const _UnstyledButton = React.forwardRef<
  HTMLDivElement,
  UnstyledButtonProps  & { component?: any }
>((props, ref) => {
  const { className, component = 'button', variant, ...others } = props

  return (
    <Polymorphic
      component={component}
      ref={ref}
      className={className}
      type={component === 'button' ? 'button' : undefined}
      {...others}
    />
  )
})

_UnstyledButton.displayName = 'UnstyledButton'

export const UnstyledButton = createPolymorphicComponent<'button', UnstyledButtonProps>(
  _UnstyledButton
);