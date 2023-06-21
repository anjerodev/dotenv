type RepoInfoType = {
  stars: string
  forks: string
  subscribers: string
  watchers: string
}

export const repoInfo = async (): Promise<RepoInfoType | null> => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/jepriCreations/dotenv',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    )

    if (!response?.ok) {
      return null
    }

    const json = await response.json()

    return {
      stars: String(json['stargazers_count']),
      forks: String(json['forks']),
      subscribers: String(json['subscribers_count']),
      watchers: String(json['watchers']),
    }
  } catch (error) {
    return null
  }
}

export const commitCount = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/JepriCreations/dotenv/commits?per_page=1',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    )

    if (!response?.ok) {
      return null
    }

    // get the Link header value
    const link = response.headers.get('Link')
    // extract the last page number from the Link header value
    const lastPage = link?.match(/&page=(\d+)>; rel="last"/)?.[1]
    // convert the last page number to a number
    const commitCount = Number(lastPage)

    return String(commitCount)
  } catch (error) {
    return null
  }
}

export const pullRequestCount = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      'https://api.github.com/search/issues?q=repo:JepriCreations/dotenv+is:pr',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    )

    if (!response?.ok) {
      return null
    }

    const res = await response.json()
    return String(res['total_count'])
  } catch (error) {
    return null
  }
}
