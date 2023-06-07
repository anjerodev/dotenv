export const routes = {
  HOME: '/',
  LOGIN: '/login',
  ACCOUNT: '/account',
  PROJECTS: '/projects',
  SUPPORT: '/contact',
  // Externals
  GITHUB: 'https://github.com/jepricreations/envox',
  TWITTER: 'https://twitter.com/jepricreations',

  // PROJECT: (id: string) => `/projects/${id}`,
  // DOCUMENT: (id: string, docId: string) => `/projects/${id}?doc=${docId}`,
  PROJECT: (id: string) => `/projects/${id}`,
  DOCUMENT: (id: string, docId: string) => `/projects/${id}?doc=${docId}`,

  // Api routes
  API_DOCUMENTS: (projectId: string) => `/api/projects/${projectId}/documents`,
  API_DOCUMENT: (id: string) => `/api/documents/${id}`,
  API_PROJECT_DOCUMENT: (projectId: string, documentId: string) =>
    `/api/projects/${projectId}/documents/${documentId}`,
  API_PROJECTS: '/api/projects',
  API_PROJECT: (id: string) => `/api/projects/${id}`,
  API_MEMBERS: '/api/members',
}

export const privatePaths = [routes.ACCOUNT, routes.PROJECTS]
export const publicPaths = [routes.HOME, routes.LOGIN]
