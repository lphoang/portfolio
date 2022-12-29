import express from 'express'
import type { Express } from 'express'
import { RequestHandler } from 'next/dist/server/next'

import { middleware } from '../../middlewares'
import { router } from '../../routers'

export const getServer = (nextHandler?: RequestHandler): Express => {
  const server = express()

  server.use(middleware)

  server.use(router)

  if (nextHandler) {
    server.all('*', (req, res) => nextHandler(req, res))
  }

  return server
}
