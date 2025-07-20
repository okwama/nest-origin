import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

export enum StaffRole {
  STAFF = 'staff',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'photo_url', length: 255 })
  photoUrl: string;

  @Column({ name: 'empl_no', length: 50 })
  emplNo: string;

  @Column({ name: 'id_no', length: 50 })
  idNo: string;

  @Column({ length: 255 })
  role: string;

  @Column({ name: 'phone_number', length: 50, nullable: true })
  phoneNumber: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ name: 'business_email', length: 255, nullable: true })
  businessEmail: string;

  @Column({ name: 'department_email', length: 255, nullable: true })
  departmentEmail: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  salary: number;

  @Column({ name: 'employment_type', length: 100 })
  employmentType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'int' })
  isActiveField: number;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('❌ Error in bcrypt.compare:', error);
      return false;
    }
  }

  isActive(): boolean {
    return this.isActiveField === 1;
  }

  // Helper methods for compatibility with existing code
  get email(): string {
    return this.businessEmail || this.departmentEmail || '';
  }

  get phone(): string {
    return this.phoneNumber || '';
  }

  get status(): StaffStatus {
    return this.isActiveField === 1 ? StaffStatus.ACTIVE : StaffStatus.INACTIVE;
  }

  get staffRole(): StaffRole {
    return this.role === 'admin' ? StaffRole.ADMIN : 
           this.role === 'manager' ? StaffRole.MANAGER : StaffRole.STAFF;
  }
} 