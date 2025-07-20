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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const payroll_service_1 = require("./payroll.service");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async calculatePayroll(calculationDto) {
        return this.payrollService.calculatePayroll(calculationDto);
    }
    async getStaffPayroll(staffId, month, year, hourlyRate, req) {
        if (req.user.sub !== staffId && !req.user.canManageFinance) {
            throw new Error('Insufficient permissions');
        }
        const monthNum = parseInt(month) || new Date().getMonth() + 1;
        const yearNum = parseInt(year) || new Date().getFullYear();
        const hourlyRateNum = hourlyRate ? parseFloat(hourlyRate) : undefined;
        return this.payrollService.calculatePayroll({
            staffId,
            month: monthNum,
            year: yearNum,
            hourlyRate: hourlyRateNum,
        });
    }
    async getStaffPayrollHistory(staffId, year, req) {
        if (req.user.sub !== staffId && !req.user.canManageFinance) {
            throw new Error('Insufficient permissions');
        }
        const yearNum = year ? parseInt(year) : undefined;
        return this.payrollService.getPayrollHistory(staffId, yearNum);
    }
    async getStaffPayrollSummary(staffId, year, req) {
        if (req.user.sub !== staffId && !req.user.canManageFinance) {
            throw new Error('Insufficient permissions');
        }
        const yearNum = year ? parseInt(year) : undefined;
        return this.payrollService.getPayrollSummary(staffId, yearNum);
    }
    async getDepartmentPayrollSummary(department, month, year) {
        const monthNum = parseInt(month) || new Date().getMonth() + 1;
        const yearNum = parseInt(year) || new Date().getFullYear();
        return this.payrollService.getDepartmentPayrollSummary(department, monthNum, yearNum);
    }
    async getMyPayroll(month, year, hourlyRate, req) {
        const monthNum = parseInt(month) || new Date().getMonth() + 1;
        const yearNum = parseInt(year) || new Date().getFullYear();
        const hourlyRateNum = hourlyRate ? parseFloat(hourlyRate) : undefined;
        return this.payrollService.calculatePayroll({
            staffId: req.user.sub,
            month: monthNum,
            year: yearNum,
            hourlyRate: hourlyRateNum,
        });
    }
    async getMyPayrollHistory(year, req) {
        const yearNum = year ? parseInt(year) : undefined;
        return this.payrollService.getPayrollHistory(req.user.sub, yearNum);
    }
    async getMyPayrollSummary(year, req) {
        const yearNum = year ? parseInt(year) : undefined;
        return this.payrollService.getPayrollSummary(req.user.sub, yearNum);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, permissions_decorator_1.RequirePermissions)('canManageFinance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "calculatePayroll", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    __param(0, (0, common_1.Param)('staffId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Query)('hourlyRate')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getStaffPayroll", null);
__decorate([
    (0, common_1.Get)('staff/:staffId/history'),
    __param(0, (0, common_1.Param)('staffId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getStaffPayrollHistory", null);
__decorate([
    (0, common_1.Get)('staff/:staffId/summary'),
    __param(0, (0, common_1.Param)('staffId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getStaffPayrollSummary", null);
__decorate([
    (0, common_1.Get)('department/:department'),
    (0, permissions_decorator_1.RequirePermissions)('canManageFinance'),
    __param(0, (0, common_1.Param)('department')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getDepartmentPayrollSummary", null);
__decorate([
    (0, common_1.Get)('my-payroll'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('hourlyRate')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayroll", null);
__decorate([
    (0, common_1.Get)('my-history'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayrollHistory", null);
__decorate([
    (0, common_1.Get)('my-summary'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayrollSummary", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('hr/payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map