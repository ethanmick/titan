import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import { database } from '../config'
import { User } from './user'
import { Building } from './building'
import { Resource } from './resource'

createConnection({
  ...database,
  entities: [Building, Resource, User]
} as any)

export const connection = getConnection
export * from './user'
export * from './building'
export * from './resource'
