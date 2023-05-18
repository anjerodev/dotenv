import { RequestError } from './request-error-handler'

export const fetcher = async <T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' = 'GET',
  data?: any
): Promise<T> => {
  const options: RequestInit = {
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
    console.log({ error })
    throw error
  }
}
