import cors from 'cors'
import { Router, json, urlencoded } from 'express'
import helmet from 'helmet'

import { CorsOptions, HelmetOptions } from '../const'

const middleware = Router()

middleware.use(helmet(HelmetOptions))
middleware.use(cors(CorsOptions))
middleware.use(json())
middleware.use(urlencoded({ extended: false }))

export { middleware }
