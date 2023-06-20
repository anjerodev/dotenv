import { routes } from '@/constants/routes'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'dotenv',
  description: 'A place to keep your projects .env files',
  mainNav: [
    {
      title: 'dotenv',
      href: '/',
    },
  ],
  links: {
    twitter: routes.TWITTER,
    github: routes.GITHUB,
  },
}
