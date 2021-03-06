import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import { database } from '../config'
import { Building } from './building'
import { Research } from './research'
import { Resource } from './resource'
import { Ship } from './ship'
import { Task } from './task'
import { User } from './user'
import { UserResource } from './user_resource'

createConnection({
  ...database,
  entities: [Building, Resource, Research, Ship, Task, User, UserResource],
  logging: ['error']
} as any)

export const connection = getConnection
export * from './building'
export * from './research'
export * from './resource'
export * from './ship'
export * from './task'
export * from './user'
export * from './user_resource'
