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
import formulas, {
  BuildingFormula,
  OptionalFormulaContext,
  ResourceBlock
} from '../game/formulas'
import { User } from './user'

@Entity('buildings')
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  level: number

  @Column()
  resource: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  // Calculated Methods
  private get formula(): BuildingFormula {
    const formula = (formulas as any)[this.resource]
    if (!formula) {
      throw new Error(`No formula found for ${this.resource}`)
    }
    return formula
  }

  public cost(): ResourceBlock {
    return this.formula.cost({ d: 0, T: 0, E: 0, L: this.level })
  }

  public production(ctx: OptionalFormulaContext = {}) {
    return this.formula.production({
      L: this.level,
      d: ctx.d || 0.0,
      T: ctx.T || 0.0,
      E: ctx.E || 1.0
    })
  }

  public consumption() {
    return this.formula.consumption({ d: 0, T: 0, E: 0, L: this.level })
  }
}
