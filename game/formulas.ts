import { Building, BuildingFormulaContext } from './building'
import { MS_PER_HOUR } from './constants'
import { GameState } from './state'

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

  private _E: number = 0

  public get E(): number {
    return this._E
  }

  public set E(e: number) {
    this._E = isNaN(e) ? 0 : Math.min(e, 1.0)
  }

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

    let energyProduction = 0
    let energyConsumption = 0
    for (let b of state?.buildings ?? []) {
      const ctx_b = new FormulaContext()
      energyProduction += ctx_b.building(b).production().energy ?? 0
      energyConsumption += ctx_b.building(b).consumption().energy ?? 0
    }
    ctx.E = energyProduction / energyConsumption
    return ctx
  }
}
