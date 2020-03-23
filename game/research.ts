import { BuildingType, Requirements } from './building'
import { MS_PER_HOUR, SPEED } from './constants'
import { FormulaContext, ResourceBlock } from './formulas'
import { Task } from './task'

export enum ResearchType {
  EnergyTechnology = 'EnergyTechnology',
  CombustionDrive = 'CombustionDrive'
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

// Laser Tech

// Ion Tech

// Armor Tech

// Impulse drive

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
  }
]
