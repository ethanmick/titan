import express, { NextFunction, Request, Response } from 'express'
import { last } from 'lodash'
import { UnauthorizedError } from '../../errors'
import { User } from '../../models'
import { buildings } from './building'
import { research } from './research'
import { resources } from './resource'
import { state } from './state'

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
r.use('/research', research)
r.use('/resource', resources)
r.use('/state', state)

export const game = r
