import { GetServerSideProps } from 'next'
import nextCookie from 'next-cookies'
import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import { User } from '../server/models'
import { http } from '../util/api'

interface OverviewProps {
  user: User
  error?: string
}

const Overview = ({ error }: OverviewProps) => {
  if (error) {
    return <>{error}</>
  }
  return (
    <>
      <h1>Overview</h1>
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
    const buildings = await api.getBuildings()
    const user = await api.getCurrentUser()
    return {
      props: { buildings, user }
    }
  } catch (err) {
    return {
      props: { error: err.message }
    }
  }

  //
  //

  console.log('Index SSR', ctx.req.headers)
  const { token } = nextCookie(ctx)
  console.log('GOT TOKEN', token)
  api.token = token
  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end()
  try {
    console.log('fetch buildings', api.token)
    const buildings = await api.getBuildings()
    console.log('buildings', buildings)
    return {
      props: { buildings }
    }
  } catch (err) {
    await redirectOnError()
  }
  return { props: {} }
}

export default Overview
