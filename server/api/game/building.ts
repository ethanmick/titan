import express, { Request, Response } from 'express'
import { Building, Resource, Task } from '../../models'
import { ForbiddenError } from '../../errors'
import { first } from 'lodash'
import { ResourceType } from 'game/formulas'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const buildings = (await Building.find({ where: { userId: user.id } })).map(
    b => ({
      ...b,
      ...b //.cost()
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
  // Can't upgrade a building that is already upgrading
  // task.findOne({user, type: 'building.upgrade', context->>building_id = building.id})

  // Try to increase the level
  building.level++
  const cost: any = {} // building.cost()
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

  const task = new Task()
  task.user = user
  task.type = 'building.upgrade'
  task.context = {
    buildingId: building.id
  }
  await task.save()
  return res.json({ ok: 'ok' })
})

export const buildings = r
