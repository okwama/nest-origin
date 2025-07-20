import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('leave_balances')
@Index(['employeeId', 'leaveTypeId', 'year'], { unique: true })
@Index(['employeeId', 'year'])
export class LeaveBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'leave_type_id' })
  leaveTypeId: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'total_days', type: 'int', default: 0 })
  totalDays: number;

  @Column({ name: 'used_days', type: 'int', default: 0 })
  usedDays: number;

  @Column({ name: 'remaining_days', type: 'int', default: 0 })
  remainingDays: number;

  @Column({ name: 'carried_over_days', type: 'int', default: 0 })
  carriedOverDays: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 