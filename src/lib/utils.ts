import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const DEBUG = process.env.NODE_ENV === 'development'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
