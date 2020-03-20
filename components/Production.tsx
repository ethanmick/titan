import { Dictionary, map } from 'lodash'
import React from 'react'
import { ResourceBlock } from '../game'

export interface ProductionProps {
  production: ResourceBlock
}

export const Production = ({ production }: ProductionProps) => (
  <>
    {map(production as Dictionary<number>).map((val, key) => (
      <div>
        {key}:{val}
      </div>
    ))}
  </>
)
