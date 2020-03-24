import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React from 'react'
import { GameState } from '../game/'
import { http } from '../util/api'

interface ShipyardPageProps {
  state: GameState
  error?: string
}

const ShipyardPage = ({}: ShipyardPageProps) => {
  return (
    <>
      <h1>Shipyard</h1>
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
    </>
  )
}

// This always runs on the SERVER
export const getServerSideProps: GetServerSideProps = async ctx => {
  const api = http(ctx)
  try {
    const state = await api.getState()
    return {
      props: { state }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }
}

export default ShipyardPage
