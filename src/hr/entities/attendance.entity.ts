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

export enum AttendanceStatus {
  PENDING = 0,
  CHECKED_IN = 1,
  CHECKED_OUT = 2,
}

export enum AttendanceType {
  REGULAR = 'regular',
  OVERTIME = 'overtime',
  LEAVE = 'leave',
}

@Entity('attendance')
@Index(['staffId', 'date'], { unique: true })
@Index(['staffId', 'checkInTime'])
@Index(['staffId', 'checkOutTime'])
@Index(['date', 'status'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'staff_id' })
  staffId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'checkin_time', type: 'datetime', nullable: true })
  checkInTime: Date;

  @Column({ name: 'checkout_time', type: 'datetime', nullable: true })
  checkOutTime: Date;

  @Column({ name: 'checkin_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  checkInLatitude: number;

  @Column({ name: 'checkin_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  checkInLongitude: number;

  @Column({ name: 'checkout_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  checkOutLatitude: number;

  @Column({ name: 'checkout_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  checkOutLongitude: number;

  @Column({ name: 'checkin_location', type: 'varchar', length: 255, nullable: true })
  checkInLocation: string;

  @Column({ name: 'checkout_location', type: 'varchar', length: 255, nullable: true })
  checkOutLocation: string;

  @Column({ name: 'checkin_ip', type: 'varchar', length: 45, nullable: true })
  checkInIp: string;

  @Column({ name: 'checkout_ip', type: 'varchar', length: 45, nullable: true })
  checkOutIp: string;

  @Column({
    type: 'int',
    default: AttendanceStatus.CHECKED_IN,
  })
  status: AttendanceStatus;

  @Column({
    type: 'enum',
    enum: AttendanceType,
    default: AttendanceType.REGULAR,
  })
  type: AttendanceType;

  @Column({ name: 'total_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalHours: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'is_late', type: 'boolean', default: false })
  isLate: boolean;

  @Column({ name: 'late_minutes', type: 'int', default: 0 })
  lateMinutes: number;

  @Column({ name: 'device_info', type: 'text', nullable: true })
  deviceInfo: string;

  @Column({ name: 'timezone', type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Column({ name: 'shift_start', type: 'time', nullable: true })
  shiftStart: string;

  @Column({ name: 'shift_end', type: 'time', nullable: true })
  shiftEnd: string;

  @Column({ name: 'is_early_departure', type: 'boolean', default: false })
  isEarlyDeparture: boolean;

  @Column({ name: 'early_departure_minutes', type: 'int', default: 0 })
  earlyDepartureMinutes: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
} 