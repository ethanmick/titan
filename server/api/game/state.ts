import express, { Request, Response } from 'express'
import { Building } from '../../models'
import { GameState } from '../../../game/state'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const buildings = await Building.find({ where: { user } })
  const state: GameState = {
    buildings,
    temperature: 50
  }
  res.json(state)
})

export const state = r
