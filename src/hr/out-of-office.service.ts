import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutOfOffice } from './entities/out-of-office.entity';
import { CreateOutOfOfficeDto } from './dto/create-out-of-office.dto';

@Injectable()
export class OutOfOfficeService {
  constructor(
    @InjectRepository(OutOfOffice)
    private outOfOfficeRepo: Repository<OutOfOffice>,
  ) {}

  async create(dto: CreateOutOfOfficeDto & { staff_id: number }): Promise<OutOfOffice> {
    const request = this.outOfOfficeRepo.create({ ...dto, status: 0 });
    return this.outOfOfficeRepo.save(request);
  }

  async findByStaff(staff_id: number): Promise<OutOfOffice[]> {
    return this.outOfOfficeRepo.find({
      where: { staff_id },
      order: { created_at: 'DESC' },
    });
  }
} 