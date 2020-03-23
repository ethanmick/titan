import express, { Request, Response } from 'express'
import { Research } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const research = await Research.find({ where: { user } })
  res.json(research)
})

export const research = r
