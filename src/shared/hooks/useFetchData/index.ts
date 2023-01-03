import { useEffect, useState } from 'react'

type UseFetchDataProps<T> = {
  content: 'works' | 'posts'
  defaultValue: T
}

export function useFetchData<T>(props: UseFetchDataProps<T>) {
  const { defaultValue, content } = props
  const [data, setData] = useState<T>(defaultValue)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MICRO_CMS_BASE_URL || ''}/${content}`,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'X-MICROCMS-API-KEY':
                process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || ''
            }
          }
        )
        const posts = await response.json()
        return posts
      } catch (error: unknown) {
        return defaultValue
      }
    }
    fetchData()
      .then(response => setData(response))
      .catch(error => {
        console.error(error)
      })
  }, [content, defaultValue])

  return {
    data
  }
}
