import express, { Request, Response } from 'express'
import { calculate } from '../../calculate'
import { Resource } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  await calculate(user)
  const resources = await Resource.find({ where: { user } })
  res.json(resources)
})

export const resources = r
