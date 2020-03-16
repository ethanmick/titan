import express, { Request, Response } from 'express'
import { Resource } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const resources = await Resource.find({ where: { userId: user.id } })
  res.json(resources)
})

export const resources = r
