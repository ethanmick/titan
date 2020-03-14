import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../errors'

const SALT_ROUNDS = 12

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

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
    return user
  }
}
