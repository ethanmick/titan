import { Requirements } from './building'
import { Task } from './task'

export enum ShipType {
  LightFighter = 'EnergyTechnology',
  SmallCargoShip = 'EnergyTechnology',
  HeavyFighter = 'EnergyTechnology',
  LargeCargoShip = 'EnergyTechnology',
  ColonyShip = 'EnergyTechnology',
  Cruiser = 'EnergyTechnology'
}

export enum DefenseType {
  RocketLauncher = 'RocketLauncher',
  SmallShieldDome = 'SmallShieldDome',
  LightLaser = 'LightLaser'
}

export interface Ship {
  id?: number
  name: string
  description: string
  type: ShipType
  requirements?: Requirements
  task?: Task
}

export interface Defense {
  id?: number
  name: string
  description: string
  type: DefenseType
  requirements?: Requirements
  task?: Task
}

export const Ships: Ship[] = [
  {
    name: 'Light Fighter',
    description: '',
    type: ShipType.LightFighter,
    requirements: {}
  },
  {
    name: 'Small Cargo Ship',
    description: '',
    type: ShipType.SmallCargoShip,
    requirements: {}
  }
]
