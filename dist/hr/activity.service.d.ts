import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Task } from './entities/task.entity';
import { Notice } from '../notices/entities/notice.entity';
export interface ActivityFeedItem {
    type: 'attendance' | 'task' | 'notice';
    id: number;
    title: string;
    subtitle: string;
    date: Date;
}
export declare class ActivityService {
    private attendanceRepo;
    private taskRepo;
    private noticeRepo;
    constructor(attendanceRepo: Repository<Attendance>, taskRepo: Repository<Task>, noticeRepo: Repository<Notice>);
    getMyRecentActivity(user: any): Promise<ActivityFeedItem[]>;
}
