import { Dictionary, map } from 'lodash'
import React from 'react'
import { ResourceBlock } from '../game'

export interface CostProps {
  cost: ResourceBlock
}

export const Cost = ({ cost }: CostProps) => (
  <>
    {map(cost as Dictionary<number>, (val, key) => (
      <div key={key}>
        {key}:{val}
      </div>
    ))}
  </>
)
