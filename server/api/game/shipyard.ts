import express, { Request, Response } from 'express'
import { Ship } from '../../models/'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const ships = await Ship.find({ where: { user } })
  res.json(ships)
})

export const research = r
