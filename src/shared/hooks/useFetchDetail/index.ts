import { useEffect, useState } from 'react'

type UseFetchDetailProps<T> = {
  content: 'works' | 'posts'
  defaultValue: T
  id: string
}

export function useFetchDetail<T>(props: UseFetchDetailProps<T>) {
  const { defaultValue, content, id } = props
  const [data, setData] = useState<T>(defaultValue)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_MICRO_CMS_BASE_URL || ''
          }/${content}/${id}`,
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
    fetchDetail()
      .then(response => setData(response))
      .catch(error => {
        console.error(error)
      })
  }, [content, defaultValue, id])

  return {
    data
  }
}
