import { find } from 'lodash'
import { BuildingType, Requirements } from './building'
import { MS_PER_HOUR, SPEED } from './constants'
import { FormulaContext, ResourceBlock } from './formulas'
import { Task } from './task'

export enum ResearchType {
  EnergyTechnology = 'EnergyTechnology',
  CombustionDrive = 'CombustionDrive',
  ComputerTechnology = 'ComputerTechnology',
  LaserTechnology = 'LaserTechnology',
  ArmorTechnology = 'ArmorTechnology',
  ImpulseDrive = 'ImpulseDrive',
  IonTechnology = 'IonTechnology'
}

export interface Research {
  id?: number
  name: string
  description: string
  type: ResearchType
  level: number
  requirements?: Requirements
  task?: Task
}

const _cost = {
  [ResearchType.EnergyTechnology]: ({ L }: FormulaContext) => ({
    crystal: 800 * 2.0 ** (L - 1),
    deuterium: 400 * 2.0 ** (L - 1)
  }),
  [ResearchType.CombustionDrive]: ({ L }: FormulaContext) => ({
    metal: 400 * 2.0 ** (L - 1),
    deuterium: 600 * 2.0 ** (L - 1)
  }),
  [ResearchType.ComputerTechnology]: ({ L }: FormulaContext) => ({
    crystal: 400 * 2.0 ** (L - 1),
    deuterium: 600 * 2.0 ** (L - 1)
  }),
  [ResearchType.LaserTechnology]: ({ L }: FormulaContext) => ({
    metal: 200 * 2.0 ** (L - 1),
    crystal: 100 * 2.0 ** (L - 1)
  }),
  [ResearchType.ArmorTechnology]: ({ L }: FormulaContext) => ({
    metal: 1000 * 2.0 ** (L - 1)
  }),
  [ResearchType.ImpulseDrive]: ({ L }: FormulaContext) => ({
    metal: 2000 * 2.0 ** (L - 1),
    crystal: 4000 * 2.0 ** (L - 1),
    deuterium: 600 * 2.0 ** (L - 1)
  }),
  [ResearchType.IonTechnology]: ({ L }: FormulaContext) => ({
    metal: 1000 * 2.0 ** (L - 1),
    crystal: 300 * 2.0 ** (L - 1),
    deuterium: 100 * 2.0 ** (L - 1)
  })
}

export class ResearchFormulaContext extends FormulaContext {
  private type: ResearchType

  constructor(ctx: FormulaContext, research: Research) {
    super(ctx)
    this.L = research.level
    this.type = research.type
  }

  public nextLevel(): this {
    this.L++
    return this
  }

  public cost(): ResourceBlock {
    return _cost[this.type](this)
  }

  /**
   * time in ms
   */
  public time(): number {
    const { metal = 0, crystal = 0 } = this.cost()
    return (
      ((metal + crystal) / 1000) * 1.0 /*researchlab*/ * SPEED * MS_PER_HOUR
    )
  }
}

export const Researches: Research[] = [
  {
    name: 'Energy Technology',
    description:
      'Energy technology allows research into forms of energy distribution.',
    type: ResearchType.EnergyTechnology,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 1
        }
      }
    }
  },
  {
    name: 'Computer Technology',
    description: '',
    type: ResearchType.ComputerTechnology,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 1
        }
      }
    }
  },

  {
    name: 'Combustion Drive',
    description: '',
    type: ResearchType.CombustionDrive,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 1
        }
      },
      research: {
        [ResearchType.EnergyTechnology]: {
          level: 1
        }
      }
    }
  },
  {
    name: 'Laser Technology',
    description: '',
    type: ResearchType.LaserTechnology,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 1
        }
      }
    }
  },
  {
    name: 'Armor Technology',
    description: '',
    type: ResearchType.ArmorTechnology,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 2
        }
      }
    }
  },
  {
    name: 'Impulse Drive',
    description: '',
    type: ResearchType.ImpulseDrive,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 2
        }
      }
    }
  },
  {
    name: 'Ion Technology',
    description: '',
    type: ResearchType.IonTechnology,
    level: 0,
    requirements: {
      buildings: {
        [BuildingType.ResearchLab]: {
          level: 4
        }
      }
    }
  }
]

export const researchFromType = (type: ResearchType) =>
  find(Researches, { type })
