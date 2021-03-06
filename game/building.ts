import { find } from 'lodash'
import { MS_PER_HOUR, SPEED } from './constants'
import { FormulaContext, ResourceBlock } from './formulas'
import { ResearchType } from './research'
import { Task } from './task'

export enum BuildingType {
  MetalMine = 'MetalMine',
  CrystalMine = 'CrystalMine',
  DeuteriumMine = 'DeuteriumMine',
  SolarPlant = 'SolarPlant',
  RoboticsFactory = 'RoboticsFactory',
  Shipyard = 'Shipyard',
  ResearchLab = 'ResearchLab'
}

export interface LevelRequirement {
  level: number
}

type BuildingRequirement = {
  [key in keyof typeof BuildingType]?: LevelRequirement
}

type ResearchRequirement = {
  [key in keyof typeof ResearchType]?: LevelRequirement
}

export interface Requirements {
  buildings?: BuildingRequirement
  research?: ResearchRequirement
}

export interface Building {
  id?: number
  name: string
  description: string
  type: BuildingType
  level: number
  requirements?: Requirements
  task?: Task
}

const _productions = {
  [BuildingType.MetalMine]: ({ d, L, E }: FormulaContext) => ({
    metal: ((30 * SPEED * L * E * 1.1 ** L) / MS_PER_HOUR) * d
  }),
  [BuildingType.CrystalMine]: ({ d, L, E }: FormulaContext) => ({
    crystal: ((20 * SPEED * L * E * 1.1 ** L) / MS_PER_HOUR) * d
  }),
  [BuildingType.DeuteriumMine]: ({ d, L, E, T }: FormulaContext) => ({
    deuterium:
      ((10 * SPEED * L * E * 1.1 ** L * (-0.002 * T + 1.28)) / MS_PER_HOUR) *
      d *
      SPEED
  }),
  [BuildingType.SolarPlant]: ({ L }: FormulaContext) => ({
    energy: 20 * L * 1.1 ** L
  }),
  [BuildingType.SolarPlant]: (_: FormulaContext) => ({}),
  [BuildingType.RoboticsFactory]: (_: FormulaContext) => ({}),
  [BuildingType.Shipyard]: (_: FormulaContext) => ({}),
  [BuildingType.ResearchLab]: (_: FormulaContext) => ({})
}

const _consumption = {
  [BuildingType.MetalMine]: ({ L }: FormulaContext) => ({
    energy: 10 * L * 1.1 ** L
  }),
  [BuildingType.CrystalMine]: ({ L }: FormulaContext) => ({
    energy: 10 * L * 1.1 ** L
  }),
  [BuildingType.DeuteriumMine]: ({ L }: FormulaContext) => ({
    energy: 20 * L * 1.1 ** L
  }),
  [BuildingType.SolarPlant]: (_: FormulaContext) => ({}),
  [BuildingType.RoboticsFactory]: (_: FormulaContext) => ({}),
  [BuildingType.Shipyard]: (_: FormulaContext) => ({}),
  [BuildingType.ResearchLab]: (_: FormulaContext) => ({})
}

const _cost = {
  [BuildingType.MetalMine]: ({ L }: FormulaContext) => ({
    metal: 60 * 1.5 ** (L - 1),
    crystal: 15 * 1.5 ** (L - 1)
  }),
  [BuildingType.CrystalMine]: ({ L }: FormulaContext) => ({
    metal: 48 * 1.6 ** (L - 1),
    crystal: 24 * 1.6 ** (L - 1)
  }),
  [BuildingType.DeuteriumMine]: ({ L }: FormulaContext) => ({
    metal: 225 * 1.5 ** (L - 1),
    crystal: 75 * 1.5 ** (L - 1)
  }),
  [BuildingType.SolarPlant]: ({ L }: FormulaContext) => ({
    metal: 75 * 1.5 ** (L - 1),
    crystal: 30 * 1.5 ** (L - 1)
  }),
  [BuildingType.RoboticsFactory]: ({ L }: FormulaContext) => ({
    metal: 400 * 2.0 ** (L - 1),
    crystal: 120 * 2.0 ** (L - 1),
    deuterium: 200 * 2.0 ** (L - 1)
  }),
  [BuildingType.Shipyard]: ({ L }: FormulaContext) => ({
    metal: 400 * 2.0 ** (L - 1),
    crystal: 200 * 2.0 ** (L - 1),
    deuterium: 100 * 2.0 ** (L - 1)
  }),
  [BuildingType.ResearchLab]: ({ L }: FormulaContext) => ({
    metal: 200 * 2.0 ** (L - 1),
    crystal: 400 * 2.0 ** (L - 1),
    deuterium: 200 * 2.0 ** (L - 1)
  })
}

export class BuildingFormulaContext extends FormulaContext {
  private type: BuildingType

  constructor(ctx: FormulaContext, building: Building) {
    super(ctx)
    this.L = building.level
    this.type = building.type
  }

  public nextLevel(): this {
    this.L++
    return this
  }

  public production(): ResourceBlock {
    console.log(this)
    return _productions[this.type](this)
  }

  public consumption(): ResourceBlock {
    return _consumption[this.type](this)
  }

  public cost(): ResourceBlock {
    return _cost[this.type](this)
  }

  /**
   * time in ms
   */
  public time(): number {
    const { metal = 0, crystal = 0 } = this.cost()
    return ((metal + crystal) / 2500) * SPEED * MS_PER_HOUR
  }
}

export const Buildings: Building[] = [
  {
    name: 'Metal Mine',
    description:
      'The metal mine gets metal from the planet and you can use it.',
    type: BuildingType.MetalMine,
    level: 0
  },
  {
    name: 'Crystal Mine',
    description:
      'Get crystal from the planet, which is used to make more things.',
    type: BuildingType.CrystalMine,
    level: 0
  },
  {
    name: 'Deuterium Synthesizer',
    description: 'Deuterium is used to power ships and research and things.',
    type: BuildingType.DeuteriumMine,
    level: 0
  },
  {
    name: 'Solar Plant',
    description: 'Produces energy from the sun. Energy is used to power mines',
    type: BuildingType.SolarPlant,
    level: 0
  },
  {
    name: 'Robotics Factory',
    description:
      'Reduce the time taken to construct buildings but not research times nor that of defensive structures.',
    type: BuildingType.RoboticsFactory,
    level: 0
  },
  {
    name: 'Shipyard',
    description:
      'The Shipyard is responsible for constructing all ships and defensive structures',
    type: BuildingType.SolarPlant,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.RoboticsFactory]: {
          level: 2
        }
      }
    }
  },
  {
    name: 'Research Lab',
    description: 'allows you to conduct Research. ',
    type: BuildingType.ResearchLab,
    level: 0
  }
]

export const buildingFromType = (type: BuildingType) =>
  find(Buildings, { type })
