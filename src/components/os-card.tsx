import React from 'react'

interface OSCardProps {
  title: string
  content: string
  icon?: React.ReactElement
}

export const OSCard = ({ title, content, icon }: OSCardProps) => {
  return (
    <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-foreground/5 p-4">
      <p className="!mb-0 text-muted-foreground">{title}</p>
      <p className="text-3xl">{content}</p>
      {icon && (
        <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 rotate-12 opacity-5">
          {React.cloneElement(icon, { size: '6rem' })}
        </div>
      )}
    </div>
  )
}
