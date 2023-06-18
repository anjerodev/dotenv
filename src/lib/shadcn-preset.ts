import type { Config } from 'tailwindcss'
import { shadcnPlugin } from './shadcn-theme'

export const shadcnPreset = {
  darkMode: ['class'],
  content: [],
  plugins: [shadcnPlugin, require('tailwindcss-animate')],
} satisfies Config
