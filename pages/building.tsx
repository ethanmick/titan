import React from 'react'
import { GetServerSideProps } from 'next'
import { Resource } from '../server/models'
import { http } from '../util/api'

interface BuildingsProps {}

const Buildings = ({}: BuildingsProps) => {
  return (
    <>
      <h1>Buildings</h1>
      <div></div>
    </>
  )
}

// This always runs on the SERVER
export const getServerSideProps: GetServerSideProps = async ctx => {
  const api = http(ctx)
  try {
    const user = await api.getCurrentUser()
    const resources = {} // Resource.find({ where: { user } })
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
