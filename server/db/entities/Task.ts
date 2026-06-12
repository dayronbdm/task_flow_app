import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

// task table - each task belongs to a user
@Index('fk_task_user_idx', ['userId'], {})
@Entity('task', { schema: 'sase_final_2026' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'task_id', unsigned: true })
  taskId: number

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number

  @Column('varchar', { name: 'title', length: 255 })
  title: string

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('enum', { name: 'status', enum: ['todo', 'in_progress', 'done'], default: 'todo' })
  status: TaskStatus

  @Column('enum', { name: 'priority', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: TaskPriority

  @Column('date', { name: 'due_date', nullable: true })
  dueDate: string | null

  @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null

  // used for soft deletes, we dont actually remove the row
  @Column('datetime', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  // many tasks can belong to one user
  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User
}
