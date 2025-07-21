import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,
  ) {}

  async getMyRecentActivity(user: any): Promise<ActivityFeedItem[]> {
    const staffId = user.id;
    const countryId = user.countryId;

    // Fetch recent attendance
    const attendance = await this.attendanceRepo.find({
      where: { staffId },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    // Fetch recent tasks
    const tasks = await this.taskRepo.find({
      where: { salesRepId: staffId },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    // Fetch recent notices (by country)
    const notices = await this.noticeRepo.find({
      where: { countryId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // Map to unified feed items
    const activity: ActivityFeedItem[] = [
      ...attendance.map(a => ({
        type: 'attendance' as const,
        id: a.id,
        title: a.status === 1 ? 'Checked In' : a.status === 2 ? 'Checked Out' : 'Attendance',
        subtitle: a.date ? `Date: ${a.date.toISOString().split('T')[0]}` : '',
        date: a.createdAt,
      })),
      ...tasks.map(t => ({
        type: 'task' as const,
        id: t.id,
        title: t.title,
        subtitle: t.status ? `Status: ${t.status}` : '',
        date: t.createdAt,
      })),
      ...notices.map(n => ({
        type: 'notice' as const,
        id: n.id,
        title: n.title,
        subtitle: n.content?.slice(0, 40) ?? '',
        date: n.createdAt,
      })),
    ];

    // Sort by date descending
    activity.sort((a, b) => b.date.getTime() - a.date.getTime());
    // Return top 10
    return activity.slice(0, 10);
  }
} 