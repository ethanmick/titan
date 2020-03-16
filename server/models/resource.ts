import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { User } from './user'

@Entity('resources')
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @ManyToOne(() => User)
  user: User

  @Column()
  resource: string
  // typpe?

  @Column()
  amount: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  public add(res: any) {
    this.amount += res[this.resource]
  }
}
