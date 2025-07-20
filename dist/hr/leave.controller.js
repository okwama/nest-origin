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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const leave_service_1 = require("./leave.service");
const create_leave_request_dto_1 = require("./dto/create-leave-request.dto");
const leave_request_entity_1 = require("./entities/leave-request.entity");
let LeaveController = class LeaveController {
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async createLeaveRequest(createDto, req) {
        const requestWithEmployeeId = {
            ...createDto,
            employeeId: req.user.id,
        };
        return this.leaveService.createLeaveRequest(requestWithEmployeeId);
    }
    async approveLeaveRequest(id, body, req) {
        return this.leaveService.approveLeaveRequest(id, req.user.id, body.notes);
    }
    async rejectLeaveRequest(id, body, req) {
        return this.leaveService.rejectLeaveRequest(id, req.user.id, body.notes);
    }
    async cancelLeaveRequest(id, req) {
        const leaveRequest = await this.leaveService.getLeaveRequestById(id);
        if (req.user.id !== leaveRequest.employeeId && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions to cancel this request');
        }
        return this.leaveService.cancelLeaveRequest(id);
    }
    async getLeaveRequests(req, employeeId, status, startDate, endDate) {
        if (employeeId && req.user.id !== parseInt(employeeId) && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const employeeIdNum = employeeId ? parseInt(employeeId) : undefined;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.leaveService.getLeaveRequests(employeeIdNum, status, start, end);
    }
    async getLeaveRequestById(id, req) {
        const leaveRequest = await this.leaveService.getLeaveRequestById(id);
        if (req.user.id !== leaveRequest.employeeId && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        return leaveRequest;
    }
    async getLeaveBalance(employeeId, req, leaveTypeId, year) {
        if (req.user.id !== employeeId && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const leaveTypeIdNum = parseInt(leaveTypeId);
        const yearNum = parseInt(year) || new Date().getFullYear();
        return this.leaveService.getLeaveBalance(employeeId, leaveTypeIdNum, yearNum);
    }
    async getLeaveBalances(employeeId, req, year) {
        if (req.user.id !== employeeId && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const yearNum = parseInt(year) || new Date().getFullYear();
        return this.leaveService.getLeaveBalances(employeeId, yearNum);
    }
    async getLeaveTypes() {
        return this.leaveService.getLeaveTypes();
    }
    async createLeaveType(leaveTypeData) {
        return this.leaveService.createLeaveType(leaveTypeData);
    }
    async updateLeaveType(id, updateData) {
        return this.leaveService.updateLeaveType(id, updateData);
    }
    async deleteLeaveType(id) {
        return this.leaveService.deleteLeaveType(id);
    }
    async getLeaveStats(req, employeeId, year) {
        if (employeeId && req.user.id !== parseInt(employeeId) && !req.user.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const employeeIdNum = employeeId ? parseInt(employeeId) : undefined;
        const yearNum = year ? parseInt(year) : undefined;
        return this.leaveService.getLeaveStats(employeeIdNum, yearNum);
    }
    async getMyLeaveRequests(req, status, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.leaveService.getLeaveRequests(req.user.id, status, start, end);
    }
    async getMyLeaveBalances(req, year) {
        const yearNum = parseInt(year) || new Date().getFullYear();
        return this.leaveService.getLeaveBalances(req.user.id, yearNum);
    }
    async getMyLeaveStats(req, year) {
        const yearNum = year ? parseInt(year) : undefined;
        return this.leaveService.getLeaveStats(req.user.id, yearNum);
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('request'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_request_dto_1.CreateLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Put)('request/:id/approve'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "approveLeaveRequest", null);
__decorate([
    (0, common_1.Put)('request/:id/reject'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "rejectLeaveRequest", null);
__decorate([
    (0, common_1.Put)('request/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "cancelLeaveRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveRequests", null);
__decorate([
    (0, common_1.Get)('request/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveRequestById", null);
__decorate([
    (0, common_1.Get)('balance/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('leaveTypeId')),
    __param(3, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveBalance", null);
__decorate([
    (0, common_1.Get)('balances/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveBalances", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveTypes", null);
__decorate([
    (0, common_1.Post)('types'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createLeaveType", null);
__decorate([
    (0, common_1.Put)('types/:id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "updateLeaveType", null);
__decorate([
    (0, common_1.Delete)('types/:id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "deleteLeaveType", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveStats", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getMyLeaveRequests", null);
__decorate([
    (0, common_1.Get)('my-balances'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getMyLeaveBalances", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getMyLeaveStats", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)('hr/leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map