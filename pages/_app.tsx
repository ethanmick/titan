import { AppProps } from 'next/app'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { http } from '../util/api'

const GameApp = ({ Component, pageProps }: AppProps) => {
  const [u, setUser] = useState(null)
  const { user } = useContext(UserContext)
  console.log('Game App User from context', user)

  useEffect(() => {
    async function getUser() {
      const api = http()
      try {
        if (api.token) {
          setUser(await api.getCurrentUser())
        }
      } catch {}
    }
    getUser()
  }, [])

  return (
    <UserContext.Provider value={{ user: u, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default GameApp
