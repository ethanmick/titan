import express, { Request, Response } from 'express'
import { Building } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const buildings = await Building.find({ where: { userId: user.id } })
  res.json(buildings)
})

export const buildings = r
