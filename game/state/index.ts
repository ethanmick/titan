import { Building } from '../building'
import { Research } from '../research'
import { Task } from '../task'

export interface GameState {
  buildings: Building[]
  research: Research[]
  tasks: Task[]
  temperature: number
}
