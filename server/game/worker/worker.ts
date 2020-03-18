import { connection, Task, Building } from '../../models'
import { get } from 'lodash'

/////////////////////////// workers ////////////////////////////////

interface BuildingFinishedTask {
  buildingId: number
}

const BuildingFinished = async ({ buildingId: id }: BuildingFinishedTask) => {
  const building = await Building.findOne(id)
  if (!building) {
    // ???
    return
  }
  building.level++
  await building?.save()
}

const getTasks = () =>
  connection()
    .getRepository(Task)
    .createQueryBuilder()
    .where('done > now()')
    .getMany()

const workers = {
  building: {
    finished: BuildingFinished
  }
}

export const execute = async () => {
  const done = await getTasks()
  for (const task of done) {
    const worker = get(workers, task.type)
    if (!worker) {
      throw new Error(
        `No worker found for ${task.type}! This should never happen and is a programmer error!`
      )
    }
    worker.execute(task.context)
  }
}
