import { find } from 'lodash'
import * as moment from 'moment'
import { FormulaContext, GameState } from '../../game'
import { Building, User } from '../models'
import { Resource } from '../models/resource'

const AVERAGE_TEMPERATURE = 50

/**
 * Calculate
 *
 * @param param User
 */
export const calculate = async (user: User) => {
  const lastGameUpdate = moment.utc(user.lastGameUpdate)
  const now = moment.utc()
  const d = now.diff(lastGameUpdate)
  console.log('ms to calculate diff', d)
  user.lastGameUpdate = moment.utc().toDate()
  await user.save()

  // Fetch the current state
  const state: GameState = {
    buildings: await Building.find({ where: { user } }),
    temperature: AVERAGE_TEMPERATURE
  }

  const ctx = FormulaContext.fromState(state)
  ctx.d = d

  // Calculate resources
  const resources = await Resource.find({ where: { user } })

  // better way to do this?
  for (let b of state.buildings) {
    console.log('Calcilate', b.type)
    const made = ctx.building(b).production()
    console.log('MADE', made)
    for (let [key] of Object.entries(made)) {
      const res = find(resources, { resource: key })
      console.log('For made', key, ' found res', res)
      res?.add(made)
    }
  }

  for (const res of resources) {
    await res.save()
  }
}
