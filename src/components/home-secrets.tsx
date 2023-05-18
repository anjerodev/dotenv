'use client'

import { useEffect, useState } from 'react'

export default function HomeSecrets() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    let intervalId: NodeJS.Timer
    if (dots.length < 7) {
      intervalId = setInterval(() => {
        setDots((prevDots) => prevDots + '•')
      }, 150)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [dots])

  return (
    <div className="group relative inline-block w-fit rounded-md bg-brand-500/10 px-4 transition-all hover:bg-brand-500/25">
      <span className="absolute inset-0 px-4 text-left transition-opacity group-hover:opacity-0">
        <span>{dots}</span>
        {dots.length < 7 && (
          <span
            className="animate-pulse text-brand-500 duration-1000"
            style={{ marginLeft: -16 }}
          >
            |
          </span>
        )}
      </span>
      <span className="opacity-0 transition-opacity group-hover:opacity-100">
        secrets
      </span>
    </div>
  )
}
