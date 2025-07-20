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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const staff_service_1 = require("../users/staff.service");
let TaskService = class TaskService {
    constructor(taskRepository, staffService) {
        this.taskRepository = taskRepository;
        this.staffService = staffService;
    }
    async createTask(createDto) {
        const { salesRepId, assignedById, ...taskData } = createDto;
        const assignedStaff = await this.staffService.findOne(salesRepId);
        if (!assignedStaff) {
            throw new common_1.NotFoundException('Assigned staff not found');
        }
        if (assignedById) {
            const assigner = await this.staffService.findOne(assignedById);
            if (!assigner) {
                throw new common_1.NotFoundException('Assigner not found');
            }
        }
        const task = this.taskRepository.create({
            ...taskData,
            salesRepId,
            assignedById,
            priority: taskData.priority || task_entity_1.TaskPriority.MEDIUM,
            status: task_entity_1.TaskStatus.PENDING,
            isCompleted: false,
        });
        return this.taskRepository.save(task);
    }
    async updateTask(id, updateDto) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (updateDto.isCompleted && !task.isCompleted) {
            updateDto.completedAt = new Date();
            updateDto.status = task_entity_1.TaskStatus.COMPLETED;
        }
        if (updateDto.isCompleted === false && task.isCompleted) {
            updateDto.completedAt = null;
            updateDto.status = task_entity_1.TaskStatus.PENDING;
        }
        Object.assign(task, updateDto);
        return this.taskRepository.save(task);
    }
    async getTaskById(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['assignedTo', 'assignedBy'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async getTasksByStaff(salesRepId, status) {
        const whereCondition = { salesRepId };
        if (status) {
            whereCondition.status = status;
        }
        return this.taskRepository.find({
            where: whereCondition,
            relations: ['assignedTo', 'assignedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async getTasksAssignedBy(assignedById, status) {
        const whereCondition = { assignedById };
        if (status) {
            whereCondition.status = status;
        }
        return this.taskRepository.find({
            where: whereCondition,
            relations: ['assignedTo', 'assignedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async getAllTasks(status, priority, salesRepId, assignedById, startDate, endDate) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }
        if (priority) {
            queryBuilder.andWhere('task.priority = :priority', { priority });
        }
        if (salesRepId) {
            queryBuilder.andWhere('task.salesRepId = :salesRepId', { salesRepId });
        }
        if (assignedById) {
            queryBuilder.andWhere('task.assignedById = :assignedById', { assignedById });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('task.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        return queryBuilder
            .leftJoinAndSelect('task.assignedTo', 'assignedTo')
            .leftJoinAndSelect('task.assignedBy', 'assignedBy')
            .orderBy('task.createdAt', 'DESC')
            .getMany();
    }
    async completeTask(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.isCompleted) {
            throw new common_1.BadRequestException('Task is already completed');
        }
        task.isCompleted = true;
        task.status = task_entity_1.TaskStatus.COMPLETED;
        task.completedAt = new Date();
        return this.taskRepository.save(task);
    }
    async cancelTask(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.status === task_entity_1.TaskStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed task');
        }
        task.status = task_entity_1.TaskStatus.CANCELLED;
        return this.taskRepository.save(task);
    }
    async deleteTask(id) {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Task not found');
        }
    }
    async getTaskStats(salesRepId, assignedById) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        if (salesRepId) {
            queryBuilder.andWhere('task.salesRepId = :salesRepId', { salesRepId });
        }
        if (assignedById) {
            queryBuilder.andWhere('task.assignedById = :assignedById', { assignedById });
        }
        const [total, pending, completed, cancelled, overdue] = await Promise.all([
            queryBuilder.getCount(),
            queryBuilder.clone().andWhere('task.status = :status', { status: task_entity_1.TaskStatus.PENDING }).getCount(),
            queryBuilder.clone().andWhere('task.status = :status', { status: task_entity_1.TaskStatus.COMPLETED }).getCount(),
            queryBuilder.clone().andWhere('task.status = :status', { status: task_entity_1.TaskStatus.CANCELLED }).getCount(),
            queryBuilder.clone().andWhere('task.dueDate < :now AND task.status != :completed', {
                now: new Date(),
                completed: task_entity_1.TaskStatus.COMPLETED
            }).getCount(),
        ]);
        return {
            total,
            pending,
            completed,
            cancelled,
            overdue,
            completionRate: total > 0 ? (completed / total) * 100 : 0,
        };
    }
    async getOverdueTasks() {
        return this.taskRepository.find({
            where: {
                dueDate: (0, typeorm_2.Between)(new Date(0), new Date()),
                status: task_entity_1.TaskStatus.PENDING,
            },
            relations: ['assignedTo', 'assignedBy'],
            order: { dueDate: 'ASC' },
        });
    }
    async getTasksDueToday() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        return this.taskRepository.find({
            where: {
                dueDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
                status: task_entity_1.TaskStatus.PENDING,
            },
            relations: ['assignedTo', 'assignedBy'],
            order: { priority: 'DESC', dueDate: 'ASC' },
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        staff_service_1.StaffService])
], TaskService);
//# sourceMappingURL=task.service.js.map