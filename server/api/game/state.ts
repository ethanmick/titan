import express, { Request, Response } from 'express'
import { GameState } from '../../../game/state'
import { Building, Task } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const buildings = await Building.find({ where: { user } })
  const tasks = await Task.find({ where: { user } })
  const state: GameState = {
    buildings,
    tasks,
    temperature: 50
  }
  res.json(state)
})

export const state = r
