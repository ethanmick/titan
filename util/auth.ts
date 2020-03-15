import Cookies from 'universal-cookie'
import nextCookie from 'next-cookies'
import { NextPageContext } from 'next'
import { User } from '../server/models'
const COOKIE_NAME = 'auth'

export interface Authentication {
  token?: string
}

export const authenticated = async (user: User) => {
  const cookies = new Cookies()
  cookies.set(COOKIE_NAME, user)
}

export const getAuth = (
  ctx: NextPageContext | undefined = undefined
): Authentication => {
  try {
    const { auth } = ctx ? nextCookie(ctx) : new Cookies().getAll()
    return auth
  } catch {
    return {}
  }
}
