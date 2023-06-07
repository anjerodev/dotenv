import { useEffect, useRef, useState } from 'react'

export function useDebounce<T = any>(
  defaultValue: T,
  wait: number,
  options = { leading: false }
) {
  const [value, setValue] = useState<T>(defaultValue)
  const timeoutRef = useRef<number | null>(null)
  const leadingRef = useRef<boolean>(true)

  const clearTimeoutRef = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => clearTimeoutRef, [])

  const debouncedSetValue = (newValue: T) => {
    clearTimeoutRef()
    if (leadingRef.current && options.leading) {
      setValue(newValue)
    } else {
      timeoutRef.current = window.setTimeout(() => {
        leadingRef.current = true
        setValue(newValue)
      }, wait)
    }
    leadingRef.current = false
  }

  return [value, debouncedSetValue] as const
}
