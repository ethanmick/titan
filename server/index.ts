import express from 'express'
import next from 'next'
import { api } from './api'
import { startFinishedTaskLoop } from './game/worker'
import { connection } from './models'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const main = async () => {
  await app.prepare()
  await connection()

  setInterval(startFinishedTaskLoop, 1000)

  const server = express()

  server.use('/public', express.static('public'))
  server.use('/api', api)

  server.all('*', (req: any, res: any) => {
    return handle(req, res)
  })

  server.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}

main()
