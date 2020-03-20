import { find } from 'lodash'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Cost, Production } from '../components'
import { Building, Buildings, FormulaContext, GameState } from '../game/'
import { Resource } from '../server/models'
import { http } from '../util/api'

interface BuildingRowProps {
  building: Building
  ctx: FormulaContext
  upgrade: (b: Building) => any
}

const BuildingRow = ({ building, ctx, upgrade }: BuildingRowProps) => {
  const F = ctx.building(building)

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    upgrade(building)
  }

  return (
    <div>
      <div>
        <h2>{building.name}</h2>
        <p>{building.description}</p>
        <div>Level: {building.level}</div>
        <div>
          currently producing:
          <Production production={F.perHour().production()} />
        </div>
        <Cost cost={F.consumption()} />
      </div>
      <div>
        Next Level upgrade
        <Cost cost={F.nextLevel().cost()} />
        <button onClick={onClick}>Upgrade</button>
      </div>
    </div>
  )
}

interface BuildingsProps {
  resources: Resource[]
  buildings: Building[]
  state: GameState
  error?: string
}

const BuildingPage = ({
  state,
  buildings,
  error,
  resources
}: BuildingsProps) => {
  const upgrade = async (building: Building) => {
    const api = http()
    try {
      await api.upgradeBuilding((building as any).id)
    } catch {
      console.log('no resources, or something')
    }
  }

  if (error) {
    return <div>{error}</div>
  }

  // Context for calculating values
  const ctx = FormulaContext.fromState(state)

  return (
    <>
      <h1>Buildings</h1>
      <div>
        {resources.map(r => (
          <div key={r.id}>
            {r.resource}:{r.amount}
          </div>
        ))}
      </div>
      <div>
        {buildings.map(b => (
          <BuildingRow key={b.name} ctx={ctx} building={b} upgrade={upgrade} />
        ))}
      </div>
    </>
  )
}

// This always runs on the SERVER
export const getServerSideProps: GetServerSideProps = async ctx => {
  const api = http(ctx)
  try {
    const resources = await api.getResources()
    const state = await api.getState()
    const buildings = Buildings.map(b => ({
      ...b,
      ...(find(state.buildings, { type: b.type }) ?? {})
    }))
    return {
      props: { state, buildings, resources }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }
}

export default BuildingPage
