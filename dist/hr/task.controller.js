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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const task_service_1 = require("./task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const task_entity_1 = require("./entities/task.entity");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    async createTask(createDto, req) {
        if (createDto.salesRepId !== req.user.sub && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to assign tasks');
        }
        if (!createDto.assignedById) {
            createDto.assignedById = req.user.sub;
        }
        return this.taskService.createTask(createDto);
    }
    async updateTask(id, updateDto, req) {
        const task = await this.taskService.getTaskById(id);
        if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to update this task');
        }
        return this.taskService.updateTask(id, updateDto);
    }
    async getTaskById(id, req) {
        const task = await this.taskService.getTaskById(id);
        if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to view this task');
        }
        return task;
    }
    async getAllTasks(req, status, priority, salesRepId, assignedById, startDate, endDate) {
        if (salesRepId && req.user.sub !== parseInt(salesRepId) && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const salesRepIdNum = salesRepId ? parseInt(salesRepId) : undefined;
        const assignedByIdNum = assignedById ? parseInt(assignedById) : undefined;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.taskService.getAllTasks(status, priority, salesRepIdNum, assignedByIdNum, start, end);
    }
    async getTasksByStaff(salesRepId, req, status) {
        if (req.user.sub !== salesRepId && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        return this.taskService.getTasksByStaff(salesRepId, status);
    }
    async getTasksAssignedBy(assignedById, req, status) {
        if (req.user.sub !== assignedById && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        return this.taskService.getTasksAssignedBy(assignedById, status);
    }
    async completeTask(id, req) {
        const task = await this.taskService.getTaskById(id);
        if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to complete this task');
        }
        return this.taskService.completeTask(id);
    }
    async cancelTask(id, req) {
        const task = await this.taskService.getTaskById(id);
        if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to cancel this task');
        }
        return this.taskService.cancelTask(id);
    }
    async deleteTask(id) {
        return this.taskService.deleteTask(id);
    }
    async getTaskStats(req, salesRepId, assignedById) {
        if (salesRepId && req.user.sub !== parseInt(salesRepId) && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const salesRepIdNum = salesRepId ? parseInt(salesRepId) : undefined;
        const assignedByIdNum = assignedById ? parseInt(assignedById) : undefined;
        return this.taskService.getTaskStats(salesRepIdNum, assignedByIdNum);
    }
    async getOverdueTasks() {
        return this.taskService.getOverdueTasks();
    }
    async getTasksDueToday(req) {
        if (req.user.canManageUsers) {
            return this.taskService.getTasksDueToday();
        }
        else {
            const allTasks = await this.taskService.getTasksDueToday();
            return allTasks.filter(task => task.salesRepId === req.user.sub);
        }
    }
    async getMyTasks(req, status) {
        return this.taskService.getTasksByStaff(req.user.sub, status);
    }
    async getMyAssignedTasks(req, status) {
        return this.taskService.getTasksAssignedBy(req.user.sub, status);
    }
    async getMyTaskStats(req) {
        return this.taskService.getTaskStats(req.user.sub);
    }
    async getMyTasksDueToday(req) {
        const allTasks = await this.taskService.getTasksDueToday();
        return allTasks.filter(task => task.salesRepId === req.user.sub);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('priority')),
    __param(3, (0, common_1.Query)('salesRepId')),
    __param(4, (0, common_1.Query)('assignedById')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Get)('staff/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasksByStaff", null);
__decorate([
    (0, common_1.Get)('assigned-by/:assignedById'),
    __param(0, (0, common_1.Param)('assignedById', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasksAssignedBy", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "completeTask", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "cancelTask", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('salesRepId')),
    __param(2, (0, common_1.Query)('assignedById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskStats", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, permissions_decorator_1.RequirePermissions)('canManageUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getOverdueTasks", null);
__decorate([
    (0, common_1.Get)('due-today'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasksDueToday", null);
__decorate([
    (0, common_1.Get)('my-tasks'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getMyTasks", null);
__decorate([
    (0, common_1.Get)('my-assigned'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getMyAssignedTasks", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getMyTaskStats", null);
__decorate([
    (0, common_1.Get)('my-due-today'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getMyTasksDueToday", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('hr/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map