import type { CSSProperties } from 'react'

export type ClassNames<StylesNames extends string> = Partial<
  Record<StylesNames, string>
>
export interface DefaultProps<
  StylesNames extends string = never,
  StylesParams extends Record<string, any> = Record<string, any>
> {
  className?: string
  style?: CSSProperties
  classNames?: ClassNames<StylesNames>
}

export type BasicSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
