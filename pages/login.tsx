import React, { useState, useContext } from 'react'
import cookie from 'js-cookie'
import Router from 'next/router'
import { UserContext } from '../context/UserContext'
import { http } from '../util/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const api = http()
      const user = await api.login({ username, password })
      setUser(user)
      const { token } = user
      console.log('Successful login, token:', token)
      api.token = token
      cookie.set('token', token)
      Router.push('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
