import { RequestError } from './request-error-handler'

export const fetcher = async <T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' = 'GET',
  next?: any,
  data?: any
): Promise<T> => {
  const options: RequestInit = {
    next,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      throw new RequestError(errorData)
    }

    return response.json()
  } catch (error) {
    throw error
  }
}
