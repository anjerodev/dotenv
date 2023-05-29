import { useEffect } from 'react'

type KeyItem = [string, (event: KeyboardEvent) => void]

const useKey = (keyItems: KeyItem[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      keyItems.forEach(([targetKey, handler]) => {
        if (key === targetKey) {
          handler(event)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keyItems])
}

export default useKey
