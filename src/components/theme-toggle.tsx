'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        fullWidth
        className="min-w-0 font-normal dark:opacity-60"
      >
        <Icons.sun
          size={20}
          className="rotate-[180deg] transition-transform duration-700 dark:rotate-0 dark:transition-none"
        />
        Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        fullWidth
        className="min-w-0 overflow-hidden font-normal opacity-60 dark:opacity-100"
      >
        <div className="relative h-5 w-5">
          <Icons.moon
            size={20}
            className="absolute inset-0 translate-y-0 opacity-100 transition-none dark:translate-y-5 dark:opacity-0 dark:transition-slide dark:duration-1000"
          />
          <Icons.moon
            size={20}
            className="absolute inset-0 -translate-y-5 opacity-0 transition-none dark:translate-y-0 dark:opacity-100 dark:transition-slide dark:duration-1000"
          />
        </div>
        Dark
      </Button>
    </div>
  )
}
