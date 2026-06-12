import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Task } from './Task'

@Index('uq_user_email', ['email'], { unique: true })
@Entity('user', { schema: 'sase_final_2026' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id', unsigned: true })
  userId: number

  @Column('varchar', { name: 'username', length: 80 })
  username: string

  @Column('varchar', { name: 'email', unique: true, length: 255 })
  email: string

  @Column('varchar', { name: 'password_hash', length: 255 })
  passwordHash: string

  @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('datetime', { name: 'last_login_at', nullable: true })
  lastLoginAt: Date | null

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[]
}
