import { Router } from 'express'

import { cmsRouter } from '../controllers/microCMS'

const router = Router()

router.use('/api', cmsRouter)

export { router }
