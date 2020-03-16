const MS_PER_HOUR = 60 * 60 * 1000

export interface OptionalFormulaContext {
  d?: number // diff in MS from last calculate
  L?: number // the level of building
  T?: number // temperature
  E?: number // energy ratio
}

export interface FormulaContext {
  d: number // diff in MS from last calculate
  L: number // the level of building
  T: number // temperature
  E: number // energy ratio
}

export interface ResourceBlock {
  metal?: number
  crystal?: number
  deuterium?: number
  energy?: number
}

export type CalculateResourceBlock = (ctx: FormulaContext) => ResourceBlock

export interface BuildingFormula {
  production: CalculateResourceBlock
  consumption: CalculateResourceBlock
  cost: CalculateResourceBlock
}

export const metal: BuildingFormula = {
  production: ({ d, L, E }) => ({
    metal: ((30 * L * E * 1.1 ** L) / MS_PER_HOUR) * d
  }),
  consumption: ({ L }) => ({
    energy: 10 * L * 1.1 ** L
  }),
  cost: ({ L }: FormulaContext) => ({
    metal: 60 * 1.5 ** (L - 1),
    crystal: 15 * 1.5 ** (L - 1)
  })
}

/*
export const crystal: BuildingFormula = {
  production: {
    crystal: ({ d, L }: FormulasContext) =>
      ((20 * L * 1.1 ** L) / MS_PER_HOUR) * d
  },
  consumption: {
    energy: ({ L }: FormulasContext) => 10 * L * 1.1 ** L
  },
  cost: {
    metal: ({ L }: FormulasContext) => 48 * 1.6 ** (L - 1),
    crystal: ({ L }: FormulasContext) => 24 * 1.6 ** (L - 1)
  }
}

export const deuterium: BuildingFormula = {
  production: {
    deuterium: ({ d, L, T }: FormulasContext) =>
      ((10 * L * 1.1 ** L * (-0.002 * T + 1.28)) / MS_PER_HOUR) * d
  },
  consumption: {
    energy: ({ L }: FormulasContext) => 20 * L * 1.1 ** L
  },
  cost: {
    metal: ({ L }: FormulasContext) => 225 * 1.5 ** (L - 1),
    crystal: ({ L }: FormulasContext) => 75 * 1.5 ** (L - 1)
  }
}

export const solar: BuildingFormula = {
  production: {
    energy: ({ d, L }: FormulasContext) =>
      ((20 * L * 1.1 ** L) / MS_PER_HOUR) * d
  },
  consumption: {},
  cost: {
    metal: ({ L }: FormulasContext) => 75 * 1.5 ** (L - 1),
    crystal: ({ L }: FormulasContext) => 30 * 1.5 ** (L - 1)
  }
}
*/

export default {
  metal
  //  crystal,
  //  deuterium,
  //  solar
}
