import { get } from 'lodash'
import { calculate } from './calculate'
import { Building, connection, Task, User } from './models'

/////////////////////////// workers ////////////////////////////////

interface BuildingFinishedTask {
  buildingId: number
}

const BuildingUpgrade = async (
  user: User,
  { buildingId: id }: BuildingFinishedTask
) => {
  const building = await Building.findOne(id)
  // This should never happen
  if (!building) {
    console.log('task building.upgrade Building not found!')
    return
  }

  await calculate(user)
  building.level++
  await building.save()
}

const getTasks = () =>
  connection()
    .getRepository(Task)
    .createQueryBuilder('task')
    .where('done_at < now()')
    .innerJoinAndSelect('task.user', 'user', 'task.user_id = user.id')
    .getMany()

const workers = {
  building: {
    upgrade: BuildingUpgrade
  }
}

export const startFinishedTaskLoop = async () => {
  const done = await getTasks()
  console.log('Finished Tasks', done)
  for (const task of done) {
    const worker = get(workers, task.type)
    if (!worker) {
      throw new Error(
        `No worker found for ${task.type}! This should never happen and is a programmer error!`
      )
    }
    try {
      await worker(task.user, task.context)
      await task.remove()
    } catch (err) {
      console.error('[Error] Worker.execute', err)
    }
  }
}
