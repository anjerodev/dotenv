import plugin from 'tailwindcss/plugin'
import { fontFamily } from 'tailwindcss/defaultTheme'

export const shadcnPlugin = plugin(
  function ({ addBase }) {
    addBase({
      ':root': {
        '--background': '220 9% 7%',
        '--foreground': '216 12% 84%',
        '--muted': '240 5% 34%',
        '--muted-foreground': '240 5% 65%',
        '--accent': '162 48% 45%',
        '--accent-foreground': '168 49% 10%',
        '--popover': '240 10% 4%',
        '--popover-foreground': '240 5% 84%',
        '--popover-border': '240 4% 16%',
        '--card': '230 8% 16%',
        '--card-foreground': '216 12% 84%',
        '--primary': '263 49% 67%',
        '--primary-foreground': '267 40% 23%',
        '--secondary': '188 83% 43%',
        '--secondary-foreground': '196 68% 15%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '0 100% 83%',
        '--success': '162 48% 45%',
        '--success-foreground': '156 72% 67%',
        '--error': '0 84% 60%',
        '--error-foreground': '0 100% 83%',
        '--warning': '38 92% 50%',
        '--warning-foreground': '48 96% 89%',
        '--radius': '0.5rem',
      },
    })
    addBase({
      '::selection': {
        '@apply bg-primary': {},
      },
      '::-moz-selection': {
        '@apply bg-primary': {},
      },
      '.dark ::selection': {
        '@apply bg-primary': {},
      },
      '.dark ::-moz-selection': {
        /* Code for Firefox */
        '@apply bg-primary': {},
      },
      body: {
        '@apply bg-background text-foreground': {},
        'font-feature-settings': '"rlig" 1, "calt" 1',
      },
    })
  },
  {
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      extend: {
        colors: {
          border: 'hsl(var(--foreground) / 0.1)',
          ring: 'hsl(var(--primary) / 0.3)',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          success: {
            DEFAULT: 'hsl(var(--success))',
            foreground: 'hsl(var(--success-foreground))',
          },
          error: {
            DEFAULT: 'hsl(var(--error))',
            foreground: 'hsl(var(--error-foreground))',
          },
          warning: {
            DEFAULT: 'hsl(var(--warning))',
            foreground: 'hsl(var(--warning-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
            border: 'hsl(var(--popover-border))',
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: 'calc(var(--radius) - 4px)',
        },
        fontFamily: {
          sans: ['var(--font-sans)', ...fontFamily.sans],
          mono: ['var(--font-mono)', ...fontFamily.mono],
        },
        transitionProperty: {
          slide: 'transform, opacity',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
          'skeleton-pulse': {
            '0%': { backgroundColor: 'hsl(var(--muted))' },
            '50%': { backgroundColor: 'hsl(var(--muted) / 0.6)' },
            '100%': { backgroundColor: 'hsl(var(--muted))' },
          },
          shaking: {
            '0%': { transform: ' rotate(0deg)' },
            '25%': { transform: 'rotate(5deg)' },
            '50%': { transform: 'rotate(0eg)' },
            '75%': { transform: 'rotate(-5deg)' },
            '100%': { transform: 'rotate(0deg)' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'skeleton-pulse':
            'skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          shaking: 'shaking 0.2s cubic-bezier(0.4, 0, 1, 1) infinite',
        },
      },
    },
  }
)
