import 'isomorphic-unfetch'
import { getAuth } from '../util/auth'
import { NextPageContext } from 'next'
import Router from 'next/router'

// TODO: this is broken?
//const API_URL: string = get(getConfig(), 'publicRuntimeConfig.api.url', '/api')
const API_URL = 'http://localhost:3000/api'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const authHeaders = (token?: string): any =>
  token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}

export const http = (ctx: any = {}) => {
  const user = getAuth(ctx)
  console.log('HTTP: found user', user)
  return new Api(user.token, ctx)
}

const handleError = async (res: Response): Promise<any> => {
  if (res.status === 204) {
    return Promise.resolve()
  }
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }

  console.log('Made a request and it failed!!!')
  let message
  if (res.bodyUsed) {
    message = (await res.clone().json()).error
  } else {
    message = [`${res.status}: ${res.statusText}`]
  }
  console.error(`api: ${message}`)
  throw new Error(message)
}

export class Api {
  constructor(public token: string | undefined, readonly ctx: any) {}

  private async _fetch<T>(uri: string, opts: RequestInit = {}): Promise<T> {
    const options = {
      method: opts.method || 'GET',
      headers: {
        ...headers,
        ...(opts.headers || {}),
        ...authHeaders(this.token)
      },
      body: opts.body
    }
    const res = await fetch(`${API_URL}${uri}`, options)

    if (res.status == 401) {
      typeof window !== 'undefined'
        ? Router.push('/login')
        : this.ctx.res.writeHead(302, { Location: '/login' }).end()
    }

    return handleError(res)
  }

  // Load tokens from cookie
  public loadAuth(ctx: NextPageContext) {
    const { token } = getAuth(ctx)
    this.token = token
  }

  public setAuth(token: string) {
    this.token = token
  }

  login = ({ username, password }: { username: string; password: string }) =>
    this._fetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

  getCurrentUser = (opts: RequestInit = {}) =>
    this._fetch<any>(`/user/me`, opts)

  getBuildings = () => this._fetch('/building')

  getResources = () => this._fetch('/resource')
}

/*
export api {
  getCurrentUser,
  getBuildings,

}
*/
