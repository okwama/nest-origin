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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const attendance_service_1 = require("./attendance.service");
const check_in_dto_1 = require("./dto/check-in.dto");
const check_out_dto_1 = require("./dto/check-out.dto");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkIn(checkInDto, req) {
        if (req.user.id !== checkInDto.staffId && !req.user.permissions?.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        if (!checkInDto.ipAddress || checkInDto.ipAddress === 'unknown') {
            checkInDto.ipAddress = req.ip ||
                req.connection?.remoteAddress ||
                req.headers['x-forwarded-for']?.split(',')[0] ||
                req.headers['x-real-ip'] ||
                'unknown';
        }
        const result = await this.attendanceService.checkIn(checkInDto);
        return {
            success: true,
            message: 'Check-in successful',
            attendanceId: result.id
        };
    }
    async checkOut(checkOutDto, req) {
        console.log('=== CHECK-OUT CONTROLLER START ===');
        console.log('Request body:', checkOutDto);
        console.log('User from JWT:', req.user);
        try {
            const staffId = req.user.id;
            console.log('Extracted staff ID:', staffId);
            const checkoutData = {
                ...checkOutDto,
                staffId,
            };
            console.log('Checkout data with staff ID:', checkoutData);
            console.log('Calling attendance service checkOut...');
            const result = await this.attendanceService.checkOut(checkoutData);
            console.log('Service result:', result);
            if (!result) {
                console.error('Check-out failed - no attendance record found');
                throw new common_1.BadRequestException('Check-out failed - no attendance record found');
            }
            console.log('Check-out successful, returning response...');
            return {
                success: true,
                message: 'Check-out successful',
                attendanceId: result.id
            };
        }
        catch (error) {
            console.error('Error in checkOut controller:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
    async getCurrentAttendance(staffId, req) {
        if (req.user.id !== staffId && !req.user.permissions?.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        return this.attendanceService.getCurrentAttendance(staffId);
    }
    async getAttendanceByStaff(staffId, req, startDate, endDate) {
        if (req.user.id !== staffId && !req.user.permissions?.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getAttendanceByStaff(staffId, start, end);
    }
    async getAttendanceByDate(date) {
        return this.attendanceService.getAttendanceByDate(new Date(date));
    }
    async getAttendanceStats(req, staffId, startDate, endDate) {
        if (staffId && req.user.id !== parseInt(staffId) && !req.user.permissions?.canManageUsers) {
            throw new Error('Insufficient permissions');
        }
        const staffIdNum = staffId ? parseInt(staffId) : undefined;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getAttendanceStats(staffIdNum, start, end);
    }
    async updateAttendance(id, updateData) {
        return this.attendanceService.updateAttendance(id, updateData);
    }
    async deleteAttendance(id) {
        return this.attendanceService.deleteAttendance(id);
    }
    async getMyAttendance(req, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getAttendanceByStaff(req.user.id, start, end);
    }
    async getMyCurrentAttendance(req) {
        const attendance = await this.attendanceService.getCurrentAttendance(req.user.id);
        if (!attendance) {
            return null;
        }
        return attendance;
    }
    async getMyAttendanceStats(req, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getAttendanceStats(req.user.id, start, end);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_in_dto_1.CheckInDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_out_dto_1.CheckOutDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('current/:staffId'),
    __param(0, (0, common_1.Param)('staffId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getCurrentAttendance", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    __param(0, (0, common_1.Param)('staffId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByStaff", null);
__decorate([
    (0, common_1.Get)('date/:date'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByDate", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('staffId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "deleteAttendance", null);
__decorate([
    (0, common_1.Get)('my-attendance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Get)('my-current'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyCurrentAttendance", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyAttendanceStats", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('hr/attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map