import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../notices/entities/notice.entity';

export interface CreateNoticeDto {
  title: string;
  content: string;
  countryId: number;
  status?: number;
}

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const notice = this.noticeRepository.create({
      ...createNoticeDto,
      status: createNoticeDto.status ?? 0, // Default to 0 if not provided
    });
    return this.noticeRepository.save(notice);
  }

  async findAll(): Promise<Notice[]> {
    return this.noticeRepository.find({ 
      where: { status: 1 }, // Only active notices
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException('Notice not found');
    }
    return notice;
  }

  async update(id: number, updateDto: Partial<Notice>): Promise<Notice> {
    await this.noticeRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.noticeRepository.delete(id);
  }
} 