import { Repository } from 'typeorm';
import { Notice } from '../notices/entities/notice.entity';
export interface CreateNoticeDto {
    title: string;
    content: string;
    countryId: number;
    status?: number;
}
export declare class NoticeService {
    private noticeRepository;
    constructor(noticeRepository: Repository<Notice>);
    create(createNoticeDto: CreateNoticeDto): Promise<Notice>;
    findAll(): Promise<Notice[]>;
    findOne(id: number): Promise<Notice>;
    update(id: number, updateDto: Partial<Notice>): Promise<Notice>;
    delete(id: number): Promise<void>;
}
