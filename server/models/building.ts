import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { User } from './user'
import { BuildingType } from '../../game'

@Entity('buildings')
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: BuildingType

  @Column()
  level: number

  @Column()
  resource: string

  @Column()
  description: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
