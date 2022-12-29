import type { CorsOptions as CorsOptionsType } from 'cors'
import type { HelmetOptions as HelmetOptionsType } from 'helmet'

export const HelmetOptions: HelmetOptionsType = {
  contentSecurityPolicy: false
}

export const CorsOptions: CorsOptionsType = {
  credentials: true
}

export const Headers = {
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  X_MICROCMS_API_KEY: 'X-MICROCMS-API-KEY'
} as const
