import { Building } from '../building'
import { Task } from '../task'

export interface GameState {
  buildings: Building[]
  tasks: Task[]
  temperature: number
}
