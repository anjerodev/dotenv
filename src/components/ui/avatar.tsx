'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { BasicSizes } from '@/types/styles'
import { cn } from '@/lib/cn'

export interface AvatarProps {
  withinGroup?: boolean
  spacing?: BasicSizes
  size?: BasicSizes
}

const sizeValue = {
  xs: 'h-9 w-9',
  sm: 'h-[38px] w-[38px]',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(
  (
    {
      className,
      size = 'sm',
      spacing = 'xs',
      withinGroup = false,
      children,
      ...props
    },
    ref
  ) => {
    const spacingValue = {
      xs: '-ml-1',
      sm: '-ml-2',
      md: '-ml-3',
      lg: '-ml-4',
      xl: '-ml-5',
    }

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted bg-cover bg-center',
          sizeValue[size],
          withinGroup && 'ring-2 ring-card ' + spacingValue[spacing],
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<AvatarImageProps>(child)) {
            return React.cloneElement(child, { size })
          }
          return child
        })}
      </AvatarPrimitive.Root>
    )
  }
)
Avatar.displayName = AvatarPrimitive.Root.displayName

export interface AvatarImageProps {
  size?: BasicSizes
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps &
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, size = 'sm', ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      'aspect-square object-cover object-center',
      sizeValue[size],
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export interface AvatarGroupProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** Avatar components */
  children: React.ReactNode
  /** Negative space between Avatars */
  spacing?: BasicSizes
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (props, ref) => {
    const { children, spacing, className, ...rest } = props

    return (
      <div className={cn('flex', className)} ref={ref} {...rest}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement<AvatarProps>(child)) {
            return React.cloneElement(child, { withinGroup: true, spacing })
          }
          return null
        })}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarImage, AvatarFallback }
