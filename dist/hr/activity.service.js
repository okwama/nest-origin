"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const task_entity_1 = require("./entities/task.entity");
const notice_entity_1 = require("../notices/entities/notice.entity");
let ActivityService = class ActivityService {
    constructor(attendanceRepo, taskRepo, noticeRepo) {
        this.attendanceRepo = attendanceRepo;
        this.taskRepo = taskRepo;
        this.noticeRepo = noticeRepo;
    }
    async getMyRecentActivity(user) {
        const staffId = user.id;
        const countryId = user.countryId;
        const attendance = await this.attendanceRepo.find({
            where: { staffId },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const tasks = await this.taskRepo.find({
            where: { salesRepId: staffId },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const notices = await this.noticeRepo.find({
            where: { countryId },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const activity = [
            ...attendance.map(a => ({
                type: 'attendance',
                id: a.id,
                title: a.status === 1 ? 'Checked In' : a.status === 2 ? 'Checked Out' : 'Attendance',
                subtitle: a.date ? `Date: ${a.date.toISOString().split('T')[0]}` : '',
                date: a.createdAt,
            })),
            ...tasks.map(t => ({
                type: 'task',
                id: t.id,
                title: t.title,
                subtitle: t.status ? `Status: ${t.status}` : '',
                date: t.createdAt,
            })),
            ...notices.map(n => ({
                type: 'notice',
                id: n.id,
                title: n.title,
                subtitle: n.content?.slice(0, 40) ?? '',
                date: n.createdAt,
            })),
        ];
        activity.sort((a, b) => b.date.getTime() - a.date.getTime());
        return activity.slice(0, 10);
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(2, (0, typeorm_1.InjectRepository)(notice_entity_1.Notice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ActivityService);
//# sourceMappingURL=activity.service.js.map