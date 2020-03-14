import express, { Request, Response } from 'express'
import { User } from '../models'

const r = express.Router()

r.post('/login', async (req: Request<any>, res: Response) => {
  console.log('Data', req.body)
  const { username, password } = req.body
  const user = await User.login(username, password)
  res.json(user)
})

export const auth = r
