import React from 'react'
import { GetServerSideProps } from 'next'
import { http } from '../util/api'
import { Resource } from '../server/models'

interface BuildingsProps {
  resources: Resource[]
  error?: string
}

interface Building {
  name: string
  type: string
  upgrade?: any
}

const BUILDINGS: Building[] = [
  {
    name: 'Metal Mine',
    type: 'metal'
  }
]

const Building = ({ name, upgrade }: Building) => (
  <div>
    <h2>{name}</h2>
    <button onClick={upgrade}>Upgrade</button>
  </div>
)

const Buildings = ({ error, resources }: BuildingsProps) => {
  const upgrade = (e: any, _building: Building) => {
    e.preventDefault()
  }

  if (error) {
    return <div>{error}</div>
  }
  return (
    <>
      <h1>Buildings</h1>
      <div>
        {resources.map(r => (
          <div>
            {r.resource}:{r.amount}
          </div>
        ))}
      </div>
      <div>
        {BUILDINGS.map(b => (
          <Building
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
    console.log('TEST')
    return {
      props: { resources }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }
}

export default Buildings
