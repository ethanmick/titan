import React from 'react'
import { GetServerSideProps } from 'next'
import { http } from '../util/api'
import { Resource } from '../server/models'

interface BuildingsProps {
  resources: Resource[]
  buildings: Building[]
  error?: string
}

interface Building {
  id: number
  name: string
  description: string
  type: string
  upgrade?: any
}

const BUILDINGS: Building[] = [
  {
    id: 0,
    name: 'Metal Mine',
    description: '',
    type: 'metal'
  }
]

const Building = ({ description, name, upgrade }: Building) => (
  <div>
    <h2>{name}</h2>
    <p>{description}</p>
    <button onClick={upgrade}>Upgrade</button>
  </div>
)

const Buildings = ({ error, resources }: BuildingsProps) => {
  const upgrade = async (e: any, building: Building) => {
    e.preventDefault()
    const api = http()
    try {
      await api.upgradeBuilding(building.id)
    } catch {
      console.log('no resources, or something')
    }
  }

  if (error) {
    return <div>{error}</div>
  }
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
        {BUILDINGS.map(b => (
          <Building
            key={b.name}
            {...b}
            upgrade={(e: React.MouseEvent<HTMLElement>) => upgrade(e, b)}
          />
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
    const buildings = await api.getBuildings()
    return {
      props: { buildings, resources }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }
}

export default Buildings
