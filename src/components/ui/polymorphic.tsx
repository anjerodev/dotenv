import React, { forwardRef } from 'react'

import { DefaultProps } from '@/types/styles'
import { createPolymorphicComponent } from '@/lib/create-polymorphic-component'

export interface PolymorphicProps extends DefaultProps {
  children?: React.ReactNode
}

export const _Polymorphic = forwardRef<
  HTMLDivElement,
  PolymorphicProps & { component: any }
>(({ component, className, ...others }, ref) => {
  const Element = component || 'div'
  return <Element ref={ref} className={className} {...others} />
})

_Polymorphic.displayName = 'Polimorphic'

export const Polymorphic = createPolymorphicComponent<'div', PolymorphicProps>(
  _Polymorphic
)
