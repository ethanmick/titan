import { Building } from '../buildings'

export interface GameState {
  buildings: Building[]
  temperature: number
}
