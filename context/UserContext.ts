import { createContext } from 'react'

export interface UserContextProps {
  user?: any
  setUser: (_: any) => any
}

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: (_: any) => {}
})
