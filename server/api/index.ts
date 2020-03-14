import express, { Request, Response, NextFunction } from 'express'
import { auth } from './auth'

const r = express.Router()
r.use(express.json())

r.get('/health', async (_req: Request<any>, res: Response) => {
  res.json({ status: 'ok' })
})

r.use('/auth', auth)

r.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (!err.code) {
    console.error(err.stack)
    res.status(500)
  } else {
    res.status(err.code)
  }
  if (err.code) {
  }
  res.json({ error: err.message })
})

export const api = r
