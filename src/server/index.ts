import dotenv from 'dotenv'
import next from 'next'

import { getServer } from './modules/getServer'

dotenv.config()

const IsDevelopment = process.env.NODE_ENV !== 'production'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = getServer(handler)

    server.listen(port, () => {
      // 開発時だけ見れればいいため
      if (IsDevelopment) console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((error: unknown) => {
    console.error(error)
  })
