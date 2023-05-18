import { routes } from '@/constants/routes'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Envox',
  description: 'A place to keep your projects .env files',
  mainNav: [
    {
      title: 'Envox',
      href: '/',
    },
  ],
  links: {
    twitter: routes.TWITTER,
    github: routes.GITHUB,
  },
}
