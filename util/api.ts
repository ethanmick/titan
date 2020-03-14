import 'isomorphic-unfetch'
import getConfig from 'next/config'
import { get } from 'lodash'
const API_URL: string = get(getConfig(), 'publicRuntimeConfig.api.url', '/api')

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

const handleError = async (res: Response): Promise<any> => {
  if (res.status === 204) {
    return Promise.resolve()
  }
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  let messages
  if (res.bodyUsed) {
    messages = (await res.clone().json()).errors
  } else {
    messages = [`${res.status}: ${res.statusText}`]
  }
  console.error(`api: ${messages.join('; ')}`)
  throw new Error()
}

export class Api {
  public token?: string

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
    return handleError(res)
  }

  login = ({ username, password }: { username: string; password: string }) =>
    this._fetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
}

export const api = new Api()
