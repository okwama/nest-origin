import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Staff } from '../../users/entities/staff.entity';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web'
}

@Entity('user_devices')
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'device_id', length: 100 })
  deviceId: string;

  @Column({ name: 'device_name', length: 100, nullable: true })
  deviceName: string;

  @Column({ 
    name: 'device_type', 
    type: 'enum', 
    enum: DeviceType 
  })
  deviceType: DeviceType;

  @Column({ name: 'device_model', length: 100, nullable: true })
  deviceModel: string;

  @Column({ name: 'os_version', length: 50, nullable: true })
  osVersion: string;

  @Column({ name: 'app_version', length: 20, nullable: true })
  appVersion: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'last_used', type: 'timestamp', nullable: true })
  lastUsed: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Staff;
} 