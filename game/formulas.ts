import { GameState } from './state'
import { Building, BuildingFormulaContext } from './buildings'
import { MS_PER_HOUR } from './constants'

export interface ResourceBlock {
  metal?: number
  crystal?: number
  deuterium?: number
  energy?: number
}

export class FormulaContext {
  d: number = 0
  L: number = 0
  T: number = 0
  E: number = 0
  _type: string

  constructor(ctx?: FormulaContext) {
    this.d = ctx?.d ?? 0
    this.L = ctx?.L ?? 0
    this.T = ctx?.T ?? 0
    this.E = ctx?.E ?? 0
  }

  perHour() {
    this.d = MS_PER_HOUR
    return this
  }

  building(building: Building) {
    return new BuildingFormulaContext(this, building)
  }

  static fromState(state?: GameState) {
    const ctx = new FormulaContext()
    ctx.T = state?.temperature ?? 0
    return ctx
  }
}
