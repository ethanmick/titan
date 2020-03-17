import express, { Request, Response } from 'express'
import { Building, Resource } from '../../models'
import { ForbiddenError } from '../../errors'
import { first } from 'lodash'
import { ResourceType } from 'server/game/formulas'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const buildings = (await Building.find({ where: { userId: user.id } })).map(
    b => ({
      ...b,
      ...b.cost()
    })
  )
  res.json(buildings)
})

r.post('/:id/upgrade', async (req: Request, res: Response) => {
  const { id } = req.params
  const { user } = req.ctx
  const building = await Building.findOne({ where: { id, user } })
  if (!building) {
    throw new ForbiddenError()
  }
  // Try to increase the level
  building.level++
  const cost = building.cost()
  const resources = await Resource.find({ where: { user } })

  const toSave = []
  // Okay
  for (const resourceNameString in cost) {
    const rn = resourceNameString as ResourceType
    const costAmount = cost[rn] ?? 0
    const found = first(
      resources.filter(r => r.resource === resourceNameString)
    )
    const foundAmount = found ? found.amount : 0
    const diff = foundAmount - costAmount
    if (diff < 0) {
      throw new ForbiddenError()
    }
    if (found) {
      found.amount -= costAmount
      toSave.push(found)
    }
  }

  await Promise.all(toSave.map(r => r.save()))
  await building.save()
  return res.json(building)
})

export const buildings = r
