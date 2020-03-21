import express, { Request, Response } from 'express'
import { first } from 'lodash'
import * as moment from 'moment'
import {
  buildingFromType,
  BuildingType,
  FormulaContext,
  ResourceType
} from '../../../game'
import { ForbiddenError } from '../../errors'
import { Building, Resource, Task } from '../../models'

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

r.post('/:type/upgrade', async (req: Request, res: Response) => {
  const { type: strType } = req.params
  console.log('Tst', strType, BuildingType)
  if (!(BuildingType as any)[strType]) {
    throw new ForbiddenError('Unknown Building')
  }
  const type = (BuildingType as any)[strType] as BuildingType
  const { user } = req.ctx
  let building = await Building.findOne({ where: { type, user } })

  // If no building is found then we create a new "level 0" building
  // for the caller to upgrade
  if (!building) {
    const found = buildingFromType(type) as Building
    building = Building.create(found)
    building.user = user
    await building.save()
  }

  // TODO
  // Can't upgrade a building that is already upgrading
  // task.findOne({user, type: 'building.upgrade', context->>building_id = building.id})

  // Try to increase the level
  building.level++
  const ctx = FormulaContext.fromState().building(building)
  const cost = ctx.cost()
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

  console.log('Upgraindg will take', ctx.time())

  const task = new Task()
  task.user = user
  task.type = 'building.upgrade'
  task.doneAt = moment
    .utc()
    .add(ctx.time(), 'ms')
    .toDate()
  task.context = {
    buildingId: building.id
  }
  await task.save()
  return res.status(202).json(task)
})

export const buildings = r
