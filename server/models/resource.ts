import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './user'

@Entity('resources')
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  resource: string

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
