'use client'

import { ReactNode, createContext } from 'react'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ExternalToast, Toaster, toast as sonnerToast } from 'sonner'

import { cn } from '@/lib/cn'

const Context = createContext(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  const toastTheme = theme === 'light' ? 'light' : 'dark'

  return (
    <Context.Provider value={undefined}>
      <Toaster position="top-right" theme={toastTheme} />
      {children}
    </Context.Provider>
  )
}

interface ToastProps extends ExternalToast {
  autoClose?: boolean
}

const createToast =
  (type: BaseToastType['type'], icon: React.ReactNode) =>
  (message: string | number, { autoClose = true, ...data }: ToastProps) =>
    sonnerToast.custom(
      (t) => {
        return (
          <BaseToast
            message={message}
            description={data.description}
            onDismiss={() => {
              sonnerToast.dismiss(t)
            }}
            icon={icon}
            type={type}
          />
        )
      },
      {
        duration: autoClose
          ? data?.duration ?? calcDuration(`${message} ${data.description}`)
          : Infinity,
        id: new Date().toISOString(),
      }
    )

export const toast = {
  success: createToast('success', <Check size="18" />),
  error: createToast('error', <X size="18" />),
  info: createToast('info', <Info size="18" />),
  warning: createToast('warning', <AlertTriangle size="18" />),
}

interface BaseToastType {
  message: string | number
  description: string | number | undefined
  onDismiss?: () => void
  icon?: React.ReactNode | null
  type: 'success' | 'error' | 'info' | 'warning'
}

const BaseToast = ({
  message,
  description,
  onDismiss,
  icon,
  type = 'info',
}: BaseToastType) => {
  const color = {
    success: 'bg-succed',
    error: 'bg-error',
    info: 'bg-blue-600 dark:bg-blue-500',
    warning: 'bg-warning',
  }

  return (
    <div className="relative box-border flex w-[356px] items-center gap-5 rounded-xl border border-foreground/10 bg-zinc-100 p-4 shadow-xl dark:bg-zinc-900">
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full p-1.5 text-zinc-50 dark:text-zinc-900',
            color[type]
          )}
        >
          {icon}
        </div>
      )}

      <div>
        <p className="mb-[8px!important] font-medium leading-none text-zinc-700 dark:text-zinc-200">
          {message}
        </p>
        {description && (
          <p className="mb-0 text-sm text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        )}
      </div>

      <button
        className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-zinc-700 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-200 hover:dark:text-zinc-400"
        onClick={onDismiss}
      >
        <X size="16" />
      </button>
    </div>
  )
}

// Calc the toast duration in function of the words in the message just for fun.
// According to bing chat the average speed in adults are 200 words/minute we give it a little bit less just in case
const calcDuration = (message: string | undefined) => {
  if (!message) return 5000

  const wordsPerMinute = 165
  const words = message.split(' ')
  const numWords = words.length
  const readingTime = numWords / wordsPerMinute

  return readingTime * 60000
}
