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

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('leave_requests')
@Index(['employeeId', 'leaveTypeId', 'startDate', 'endDate'], { unique: true })
@Index(['employeeId', 'leaveTypeId', 'status'])
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'leave_type_id' })
  leaveTypeId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'is_half_day', type: 'boolean', default: false })
  isHalfDay: boolean;

  @Column({ name: 'reason', type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ name: 'attachment_url', type: 'varchar', length: 255, nullable: true })
  attachmentUrl: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @Column({ name: 'employee_type_id', default: 1 })
  employeeTypeId: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'applied_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  staff: Staff;
} 