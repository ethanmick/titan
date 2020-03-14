import express, { Request, Response } from 'express'

const r = express.Router()
r.use(express.json())

r.get('/health', async (_req: Request<any>, res: Response) => {
  res.json({ status: 'ok' })
})

export const api = r
