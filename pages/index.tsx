import React, { useContext } from 'react'
import { GetServerSideProps } from 'next'
import { User } from '../server/models'
import { http } from '../util/api'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import { UserContext } from '../context/UserContext'

interface OverviewProps {
  user: User
  error?: string
}

const Overview = ({ error }: OverviewProps) => {
  const { user } = useContext(UserContext)
  if (error) {
    return <>{error}</>
  }
  return (
    <>
      <h1>Overview</h1>
      <div>{user?.username}</div>
    </>
  )
}

// This always runs on the SERVER
export const getServerSideProps: GetServerSideProps = async ctx => {
  console.log(ctx.req.headers)
  const api = http(ctx)
  console.log('token', api.token)
  try {
    // DB??
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
