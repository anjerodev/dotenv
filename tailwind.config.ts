import { shadcnPreset } from './src/lib/shadcn-preset'

import type { Config } from 'tailwindcss'

const config = {
  presets: [shadcnPreset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f6fc',
          100: '#f1eef9',
          200: '#e5dff5',
          300: '#d0c5ed',
          400: '#b8a4e1',
          500: '#a181d4',
          600: '#8f62c5',
          700: '#7e50b1',
          800: '#694394',
          900: '#57387a',
          950: '#261738',
        },
      },
    },
  },
} satisfies Config

export default config
