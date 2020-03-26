import { Building } from '../building'
import { Research } from '../research'
import { Defense, Ship } from '../ship'
import { Task } from '../task'

export interface GameState {
  buildings: Building[]
  research: Research[]
  resources?: any
  ships: Ship[]
  defense: Defense[]
  tasks: Task[]
  temperature: number
}
