import express, { Request, Response } from 'express'
import { find, first } from 'lodash'
import * as moment from 'moment'
import {
  FormulaContext,
  researchFromType,
  ResearchType,
  ResourceType
} from '../../../game'
import { ForbiddenError } from '../../errors'
import { Building, Research, Resource, Task } from '../../models'

const r = express.Router()

r.get('/', async (req: Request, res: Response) => {
  const { user } = req.ctx
  const research = await Research.find({ where: { user } })
  res.json(research)
})

r.post('/:type/upgrade', async (req: Request, res: Response) => {
  const { type: strType } = req.params
  if (!(ResearchType as any)[strType]) {
    throw new ForbiddenError('Unknown Research')
  }
  const type = (ResearchType as any)[strType] as ResearchType
  const { user } = req.ctx
  let research = await Research.findOne({ where: { type, user } })

  // If no building is found then we create a new "level 0" building
  // for the caller to upgrade
  if (!research) {
    const found = researchFromType(type) as Research
    research = Research.create(found)
    research.user = user
    await research.save()
  }

  // TODO
  // Can't upgrade a building that is already upgrading
  // task.findOne({user, type: 'building.upgrade', context->>building_id = building.id})

  // await calculate()

  // Check Requirements
  if ((<any>research).requirements) {
    const needs = (<any>research).requirements.buildings ?? []
    const userHas = await Building.find({ where: { user } })
    for (const b of needs) {
      const userFound = find(userHas, { type: b.type })
      if (!userFound) {
        throw new ForbiddenError('Requirements not met')
      }
      if (userFound.level < b.level) {
        throw new ForbiddenError('Requirements not met')
      }
    }

    // TODO check research requirements
  }

  // Try to increase the level
  research.level++
  const ctx = FormulaContext.fromState().research(research)
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

  const task = new Task()
  task.user = user
  //TODO: Enum
  task.type = 'research.upgrade'
  task.doneAt = moment
    .utc()
    .add(ctx.time(), 'ms')
    .toDate()
  task.context = {
    researchId: research.id
  }
  await task.save()
  return res.status(202).json(task)
})

export const research = r
