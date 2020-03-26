import {
  Column,
  Entity,
  getConnection,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Resource } from './resource'
import { User } from './user'

@Entity('user_resources')
export class UserResource {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  public amount: number = 0

  @ManyToOne(
    () => User,
    user => user.userResources
  )
  @JoinColumn({ name: 'user_id' })
  public user!: User

  @ManyToOne(
    () => Resource,
    resource => resource.userResources
  )
  @JoinColumn({ name: 'resource_id' })
  public resource!: Resource

  static findForUser(user: User) {
    return getConnection()
      .getRepository(Resource)
      .createQueryBuilder('resources')
      .leftJoinAndSelect(
        'resources.userResources',
        'user_resources',
        'user_resources.user_id = :id',
        { id: user.id }
      )
      .getMany()
  }
}
