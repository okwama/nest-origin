import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('out_of_office')
export class OutOfOffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  staff_id: number;

  @Column()
  title: string;

  @Column('text')
  reason: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0=pending, 1=approved, 2=declined

  @Column({ nullable: true })
  approved_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 