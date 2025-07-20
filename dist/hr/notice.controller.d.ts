import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from '../notices/entities/notice.entity';
export declare class NoticeController {
    private readonly noticeService;
    constructor(noticeService: NoticeService);
    createNotice(createDto: CreateNoticeDto): Promise<Notice>;
    updateNotice(id: number, updateDto: UpdateNoticeDto): Promise<Notice>;
    getNoticeById(id: number): Promise<Notice>;
    getAllNotices(req: any, countryId?: string, limit?: string): Promise<Notice[]>;
    getRecentNotices(req: any, countryId?: string, limit?: string): Promise<Notice[]>;
    deleteNotice(id: number): Promise<void>;
    searchNotices(req: any, query: string, countryId?: string): Promise<Notice[]>;
    getNoticeStats(req: any, countryId?: string): Promise<any>;
    getPublicNotices(countryId?: string, limit?: string): Promise<Notice[]>;
    getPublicRecentNotices(countryId?: string, limit?: string): Promise<Notice[]>;
}
