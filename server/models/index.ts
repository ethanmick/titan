import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import { database } from '../config'
import { User } from './user'

createConnection({
  ...database,
  entities: [User]
} as any)

export const connection = getConnection
export * from './user'
