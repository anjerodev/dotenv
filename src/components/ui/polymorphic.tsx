import React, { forwardRef } from 'react'

import { DefaultProps } from '@/types/styles'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'

export interface PolymorphicProps extends DefaultProps {
  children?: React.ReactNode
  component?: any
}

const _Polymorphic = forwardRef<HTMLDivElement, PolymorphicProps>(
  ({ component, ...others }, ref) => {
    const Element = component || 'div'
    return <Element ref={ref} {...others} />
  }
)

_Polymorphic.displayName = 'Polymorphic'

export const Polymorphic = createPolymorphicComponent<'div', PolymorphicProps>(
  _Polymorphic
)
