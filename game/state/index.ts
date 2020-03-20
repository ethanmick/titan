import { Building } from '../building'

export interface GameState {
  buildings: Building[]
  temperature: number
}
