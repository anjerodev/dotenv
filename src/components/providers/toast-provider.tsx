'use client'

import { createContext, ReactNode } from 'react'
import { ExternalToast, toast as sonnerToast, Toaster } from 'sonner'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

const Context = createContext(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Context.Provider value={undefined}>
      <Toaster position="top-right" theme="dark" />
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
  success: createToast('success', <Icons.check size={18} />),
  error: createToast('error', <Icons.close size={18} />),
  info: createToast('info', <Icons.info size={18} />),
  warning: createToast('warning', <Icons.alert size={18} />),
}

interface BaseToastType {
  message: string | number
  description: ToastProps['description']
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
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-blue-500',
    warning: 'bg-warning',
  }

  return (
    <div className="relative box-border flex w-[356px] items-center gap-5 rounded-xl border border-foreground/10 bg-zinc-900 p-4 shadow-xl">
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full p-1.5 text-zinc-900',
            color[type]
          )}
        >
          {icon}
        </div>
      )}

      <div>
        <p className="mb-[8px!important] font-medium leading-none text-zinc-200">
          {message}
        </p>
        {description && (
          <p className="mb-0 text-sm text-zinc-300">{description}</p>
        )}
      </div>

      <button
        className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-zinc-200 transition-colors duration-200 hover:text-zinc-400"
        onClick={onDismiss}
      >
        <Icons.close size={16} />
      </button>
    </div>
  )
}

// Calc the toast duration in function of the words in the message just for fun.
// According to bing chat the average speed in adults are 200 words/minute we give it a little bit less just in case
const calcDuration = (message: string | undefined) => {
  if (!message) return 5000

  const wordsPerMinute = 180
  const words = message.split(' ')
  const numWords = words.length
  const readingTime = numWords / wordsPerMinute

  return readingTime * 60000
}
