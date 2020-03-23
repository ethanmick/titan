import { clone, cloneDeep, find } from 'lodash'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React from 'react'
import { Cost } from '../components'
import { FormulaContext, GameState, Research, Researches } from '../game/'
import { Resource } from '../server/models'
import { http } from '../util/api'

interface ResearchRowProps {
  research: Research
  ctx: FormulaContext
  upgrade: (r: Research) => any
}

const ResearchRow = ({ research, ctx, upgrade }: ResearchRowProps) => {
  const F = ctx.research(research)

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    upgrade(research)
  }

  return (
    <div>
      <div>
        <h2>{research.name}</h2>
        <p>{research.description}</p>
        <div>Level: {research.level}</div>
      </div>
      {research.task && (
        <div>CURRENTLY researching: {research.task.doneAt}</div>
      )}
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

interface ResearchPageProps {
  resources: Resource[]
  research: Research[]
  state: GameState
  error?: string
}

const ResearchPage = ({
  state,
  research,
  error,
  resources
}: ResearchPageProps) => {
  const upgrade = async (research: Research) => {
    const api = http()
    try {
      await api.upgradeResearch(research.type)
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
      <h1>Research</h1>
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
      </div>
      <div>
        {research.map(r => (
          <ResearchRow key={r.name} ctx={ctx} research={r} upgrade={upgrade} />
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
    const research = Researches.map(r => {
      const userResearch = find(state.research, { type: r.type }) ?? { id: 0 }
      const task = find(
        state.tasks,
        val =>
          val.type == 'research.upgrade' &&
          val.context.buildingId == userResearch.id
      )
      return {
        ...r,
        ...userResearch,
        ...(task ? { task: cloneDeep(task) } : {})
      }
    })

    return {
      props: { state, research, resources }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }
}

export default ResearchPage
