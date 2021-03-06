import bcrypt from 'bcrypt'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'
import { UnauthorizedError } from '../errors'
import { UserResource } from './user_resource'

const SALT_ROUNDS = 12

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  token: string

  @Column({ name: 'last_game_update', type: 'timestamptz' })
  lastGameUpdate: Date

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  // Relations
  @OneToMany(
    () => UserResource,
    userResource => userResource.user
  )
  public userResources!: UserResource[]

  static async register(
    username: string,
    unencryptedPassword: string
  ): Promise<User> {
    const password = await bcrypt.hash(unencryptedPassword, SALT_ROUNDS)
    const user = User.create({
      username,
      password
    })
    return await user.save()
  }

  static async login(username: string, password: string): Promise<User> {
    const user = await User.findOne({ username })
    if (!user) {
      throw new UnauthorizedError()
    }
    const success = await bcrypt.compare(password, user.password)
    if (!success) {
      throw new UnauthorizedError()
    }
    user.token = uuid()
    const saved = await user.save()
    delete saved.password
    return saved
  }
}
