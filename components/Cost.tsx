import React from 'react'
import { map, Dictionary } from 'lodash'
import { ResourceBlock } from '../game'

export interface CostProps {
  cost: ResourceBlock
}

export const Cost = ({ cost }: CostProps) => (
  <>
    {map(cost as Dictionary<number>).map((val, key) => (
      <div>
        {key}:{val}
      </div>
    ))}
  </>
)
