import { clone, cloneDeep, find } from 'lodash'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
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
          <Production
            production={clone(F)
              .perHour()
              .production()}
          />
        </div>
        <div>
          Consuming
          <Cost cost={clone(F).consumption()} />
        </div>
      </div>
      {building.task && <div>CURRENTLY BUILDING: {building.task.doneAt}</div>}
      <div>
        Next Level upgrade
        <Cost
          cost={clone(F)
            .nextLevel()
            .cost()}
        />
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
      await api.upgradeBuilding(building.type)
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
      <ul>
        <li>
          <Link href="/building">
            <a>Buildings</a>
          </Link>
        </li>
        <li>
          <Link href="/research">
            <a>Research</a>
          </Link>
        </li>
        <li>
          <Link href="/shipyard">
            <a>Shipyard</a>
          </Link>
        </li>
      </ul>
      <div>
        {resources.map(r => (
          <div key={r.id}>
            {r.resource}:{r.amount}
          </div>
        ))}
        <div>energy: ??</div>
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
    console.log('STATE', state.buildings, state.tasks)
    const buildings = Buildings.map(b => {
      const userBuilding = find(state.buildings, { type: b.type }) ?? { id: 0 }
      const task = find(
        state.tasks,
        val =>
          val.type == 'building.upgrade' &&
          val.context.buildingId == userBuilding.id
      )
      console.log('Found task for building!!', task)
      return {
        ...b,
        ...userBuilding,
        ...(task ? { task: cloneDeep(task) } : {})
      }
    })

    console.log('what hte fuck', buildings[0])

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
