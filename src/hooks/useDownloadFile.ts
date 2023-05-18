import { useState } from 'react'

type Format = 'csv' | 'txt' | 'json' | 'env'

type HookType = {
  format?: Format
  timeout?: number
}

export function useDownloadFile({
  format = 'txt',
  timeout = 3000,
}: HookType = {}) {
  const [error, setError] = useState<Error | null>(null)
  const [complete, setComplete] = useState(false)
  const [downloadTimeout, setDownloadTimeout] = useState<any>(null)

  const handleDownloadResult = (value: boolean) => {
    downloadTimeout && clearTimeout(downloadTimeout)
    setDownloadTimeout(setTimeout(() => setComplete(false), timeout))
    setComplete(value)
  }

  const download = ({ data, filename }: { data: string; filename: string }) => {
    try {
      let blob: Blob
      if (format === 'env') {
        // handle .env file format specifically
        const type = 'text/plain;charset=utf-8'
        blob = new Blob([data], { type })
      } else {
        const type = `text/${format}`
        blob = new Blob([data], { type })
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || 'download')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      handleDownloadResult(true)
    } catch (err: any) {
      setError(err)
    }
  }

  const reset = () => {
    setComplete(false)
    setError(null)
    downloadTimeout && clearTimeout(downloadTimeout)
  }

  return { download, reset, error, complete }
}
