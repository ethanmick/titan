import { map } from 'lodash'
import React from 'react'
import { ResourceBlock } from '../game'

export interface ProductionProps {
  production: ResourceBlock
}

export const Production = ({ production }: ProductionProps) => {
  return (
    <>
      {map(production as any, (val, key) => (
        <div key={key}>
          {key}:{val}
        </div>
      ))}
    </>
  )
}
