import { Router } from 'express'

import { getWorksHandler } from '../../handlers/getWorks'

const cmsRouter = Router()

cmsRouter.get('/works', getWorksHandler)

export { cmsRouter }
