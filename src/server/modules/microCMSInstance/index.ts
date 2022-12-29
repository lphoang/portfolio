import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import { Headers } from '../../const'

const { MICRO_CMS_BASE_URL = '', MICRO_CMS_API_KEY = '' } = process.env

const { X_MICROCMS_API_KEY, ACCEPT, CONTENT_TYPE } = Headers

export const microCMSInstance = (): AxiosInstance => {
  console.log(MICRO_CMS_BASE_URL)
  const instance = axios.create({
    baseURL: `${MICRO_CMS_BASE_URL}/api/v1`,
    headers: {
      [ACCEPT]: 'application/json',
      [CONTENT_TYPE]: 'application/json;charset=utf-8',
      [X_MICROCMS_API_KEY]: MICRO_CMS_API_KEY
    },
    timeout: 10_000
  })
  instance.interceptors.response.use(
    (response: AxiosResponse): Promise<AxiosError | AxiosResponse> =>
      Promise.resolve(response),
    (error: AxiosError) => Promise.reject(error)
  )
  instance.interceptors.request.use(
    request => request,
    (error: AxiosError) => Promise.reject(error)
  )
  return instance
}
