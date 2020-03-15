import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import { NextPageContext } from 'next'
const COOKIE_NAME = 'auth'

export interface Authentication {
  token?: string
}

export const authenticated = async (token: string) => {
  cookie.set(COOKIE_NAME, JSON.stringify({ token }))
}

export const getAuth = (
  ctx: NextPageContext | undefined = undefined
): Authentication => {
  try {
    const { auth } = ctx ? nextCookie(ctx) : cookie.get()
    return JSON.parse(auth ?? '')
  } catch {
    return {}
  }
}
