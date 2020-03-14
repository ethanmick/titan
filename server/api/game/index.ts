import express, { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../../errors'
import { User } from '../../models'
import { last } from 'lodash'
import { buildings } from './building'

const r = express.Router()

r.use(async (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return next(new UnauthorizedError())
  }
  const token = last(authorization.split(' '))
  const user = await User.findOne({ token })
  if (!user) {
    return next(new UnauthorizedError())
  }
  req.ctx.user = user
  next()
})

r.use('/building', buildings)

export const game = r
