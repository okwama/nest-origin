import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Staff } from '../../users/entities/staff.entity';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('tasks')
@Index(['salesRepId'])
@Index(['assignedById'])
@Index(['status'])
@Index(['priority'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'completedAt', type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ name: 'isCompleted', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'varchar',
    length: 50,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ name: 'salesRepId' })
  salesRepId: number;

  @Column({ name: 'assignedById', nullable: true })
  assignedById: number;

  @Column({ name: 'dueDate', type: 'datetime', nullable: true })
  dueDate: Date;

  // Relations
  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesRepId' })
  assignedTo: Staff;

  @ManyToOne(() => Staff, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: Staff;
} 