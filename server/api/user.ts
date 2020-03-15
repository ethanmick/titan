import express, { Request, Response } from 'express'

const r = express.Router()

r.get('/me', async (req: Request, res: Response) => {
  const { user } = req.ctx
  res.json(user)
})

export const user = r
