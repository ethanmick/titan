import { ResourceBlock, FormulaContext } from './formulas'
import { MS_PER_HOUR } from './constants'

export enum BuildingType {
  MetalMine = 'METAL_MINE',
  CrystalMine = 'CRYSTAL_MINE',
  DeuteriumMine = 'DEUTERIUM_MINE'
}

export interface Building {
  id?: number
  name: string
  description: string
  type: BuildingType
  level: number
}

const _productions = {
  [BuildingType.MetalMine]: ({ d, L, E }: FormulaContext) => ({
    metal: ((30 * L * E * 1.1 ** L) / MS_PER_HOUR) * d
  }),
  [BuildingType.CrystalMine]: ({ d, L, E }: FormulaContext) => ({
    crystal: ((20 * L * E * 1.1 ** L) / MS_PER_HOUR) * d
  }),
  [BuildingType.DeuteriumMine]: ({ d, L, E, T }: FormulaContext) => ({
    deuterium: ((10 * L * E * 1.1 ** L * (-0.002 * T + 1.28)) / MS_PER_HOUR) * d
  })
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
  })
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
    return _productions[this.type](this)
  }

  public consumption(): ResourceBlock {
    return _consumption[this.type](this)
  }

  public cost(): ResourceBlock {
    return _cost[this.type](this)
  }

  public time(): number {
    const { metal = 0, crystal = 0 } = this.cost()
    return (metal + crystal) / 2500
  }
}

export const Buildings = [
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
  }
]