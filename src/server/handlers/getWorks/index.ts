import type { Request } from 'express'

import { microCMSInstance } from '../../modules/microCMSInstance'

const getWorks = async (
  req: Request<unknown, unknown, unknown>
) => {
  console.log(req.headers)
  const endPointApi = '/works'
  const { data } = await microCMSInstance().get(endPointApi)

  return data
}

export const getWorksHandler = getWorks
