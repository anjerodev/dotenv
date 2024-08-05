'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const CardsContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.querySelectorAll<HTMLElement>('.card')
    for (const card of cards) {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }
  }

  return (
    <div
      className={cn(
        'group/cards grid grid-cols-1 gap-4 sm:grid-cols-3',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
}

interface CardButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

interface CardLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string
}

const Card = React.forwardRef(
  (
    {
      children,
      onClick,
      className,
      href,
      disabled,
      ...other
    }: CardProps & CardButtonProps & CardLinkProps,
    ref
  ) => {
    const cardStyle = cn(
      'card group/card relative cursor-pointer overflow-hidden rounded-2xl bg-foreground/20 p-px transition-all active:scale-[0.98]',
      disabled &&
        'pointer-events-none cursor-default opacity-50 active:scale-100',
      className
    )

    const Content = () => {
      return (
        <>
          {!disabled && (
            <>
              <span
                className="absolute left-0 top-0 z-[3] h-full w-full opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{
                  background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), hsla(255,255,255,0.1), transparent 40%)`,
                }}
              />
              {/* after */}
              <span
                className="absolute left-0 top-0 z-[1] h-full w-full opacity-0 transition-opacity duration-500 group-hover/cards:opacity-100"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.5), transparent 40%)`,
                }}
              />
            </>
          )}
          {/* Card Content Container */}
          <div className="relative z-[2] flex h-full w-full grow flex-col rounded-[15px] bg-card/80 px-6 py-4">
            {children}
          </div>
        </>
      )
    }

    if (onClick)
      return (
        <button onClick={onClick} className={cn(cardStyle)} {...other}>
          <Content />
        </button>
      )

    if (href)
      return (
        <Link href={href} className={cn(cardStyle)} {...other}>
          <Content />
        </Link>
      )

    return (
      <div className={cn(cardStyle)} {...other}>
        <Content />
      </div>
    )
  }
)

Card.displayName = 'Card'

export { CardsContainer, Card }
