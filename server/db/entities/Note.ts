import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Index('fk_note_user_idx', ['userId'], {})
@Entity('note', { schema: 'sase_final_2026' })
export class Note {
  @PrimaryGeneratedColumn({ type: 'int', name: 'note_id', unsigned: true })
  noteId: number

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number

  @Column('varchar', { name: 'title', length: 255 })
  title: string

  @Column('text', { name: 'content' })
  content: string

  @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User
}
