export const routes = {
  HOME: '/',
  LOGIN: '/login',
  ACCOUNT: '/account',
  PROJECTS: '/projects',
  SUPPORT: '/contact',
  // Externals
  GITHUB: 'https://github.com/jepricreations/envox',
  TWITTER: 'https://twitter.com/jepricreations',

  // API
  // ** Queries
  API_PROJECT: (id: string) => `/api/projects/${id}`,
  API_LIST_DOCUMENTS: (id: string) => `/api/projects/${id}/documents`,
  API_COUNT_DOCUMENTS: (id: string) => `/api/projects/${id}/documents/count`,
  API_DOCUMENT: ({
    projectId,
    documentId,
  }: {
    projectId: string
    documentId: string
  }) => `/api/projects/${projectId}/documents/${documentId}`,
  // ** Mutations
  API_ADD_DOCUMENT: (id: string) => `/api/projects/${id}/documents/add`,
}

export const privatePaths = [routes.ACCOUNT, routes.PROJECTS]
export const publicPaths = [routes.HOME, routes.LOGIN]
