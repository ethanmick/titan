import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import { database } from '../config'
import { Building } from './building'
import { Research } from './research'
import { Resource } from './resource'
import { Task } from './task'
import { User } from './user'

createConnection({
  ...database,
  entities: [Building, Resource, Research, Task, User]
} as any)

export const connection = getConnection
export * from './building'
export * from './research'
export * from './resource'
export * from './task'
export * from './user'
