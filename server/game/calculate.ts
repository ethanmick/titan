import { User, Building } from '../models'
import * as moment from 'moment'
import { Resource } from '../models/resource'
import { sum } from 'lodash'

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
  const T = AVERAGE_TEMPERATURE
  user.lastGameUpdate = moment.utc().toDate()
  await user.save()

  const energyProduction = sum(
    (await Building.find({ where: { type: 'energy' } })).map(b => {
      const { energy } = b.production()
      return energy
    })
  )

  const energyConsumption = sum(
    (await Building.find({ where: { user } })).map(b => {
      const { energy } = b.cost()
      return energy
    })
  )

  const E = Math.max(energyProduction / energyConsumption, 1.0)

  // Calculate resources
  const resources = await Resource.find({ where: { user } })
  for (const res of resources) {
    const building = await Building.findOne({
      where: { user, resource: res.resource }
    })
    if (!building) {
      // No building for this resource, so we don't need to change the amoutn
      continue
    }
    const gained = building.production({ d, T, E })
    res.add(gained)
    await res.save()
  }
}
