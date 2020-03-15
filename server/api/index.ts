import express, { Request, Response, NextFunction } from 'express'
import { auth } from './auth'
import { game } from './game'
import { user } from './user'

/**
 * I DO NOT WANT THIS HERE
 * I WANT IT GONE
 *
 * But I cannot, no way, figure out, how to get this typing to work
 * in the `types/express/index.d.ts` file. Nothing. Works.
 *
 * And this does. It just works.
 *
 * So if you can figure this shit out, let me know.
 */
declare global {
  namespace Express {
    interface Request {
      ctx: any
    }
  }
}

const r = express.Router()
r.use(express.json())
r.use((req: Request, _, next: NextFunction) => {
  req.ctx = {}
  next()
})

r.get('/health', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

r.use('/auth', auth)
r.use('/', game)
r.use('/user', user)

r.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (!err.httpCode) {
    // Unexpected Error, log & report
    console.error(err.stack)
    res.status(500)
  } else {
    res.status(err.httpCode)
  }
  res.json({ error: err.message })
})

export const api = r
