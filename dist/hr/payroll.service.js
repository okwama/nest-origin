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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const staff_service_1 = require("../users/staff.service");
let PayrollService = class PayrollService {
    constructor(attendanceRepository, staffService) {
        this.attendanceRepository = attendanceRepository;
        this.staffService = staffService;
    }
    async calculatePayroll(calculationDto) {
        const { staffId, month, year, hourlyRate = 10 } = calculationDto;
        const staff = await this.staffService.findOne(staffId);
        if (!staff) {
            throw new Error('Staff not found');
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const attendanceRecords = await this.attendanceRepository.find({
            where: {
                staffId,
                date: (0, typeorm_2.Between)(startDate, endDate),
                checkOutTime: (0, typeorm_2.Not)(null),
            },
        });
        let totalHours = 0;
        let overtimeHours = 0;
        let regularHours = 0;
        let lateDeductions = 0;
        let earlyDepartureDeductions = 0;
        attendanceRecords.forEach(record => {
            if (record.totalHours) {
                totalHours += record.totalHours;
                const dailyRegularHours = Math.min(record.totalHours, 8);
                regularHours += dailyRegularHours;
                const dailyOvertimeHours = Math.max(0, record.totalHours - 8);
                overtimeHours += dailyOvertimeHours;
            }
            if (record.lateMinutes > 0) {
                lateDeductions += (record.lateMinutes / 60) * hourlyRate * 0.5;
            }
            if (record.earlyDepartureMinutes > 0) {
                earlyDepartureDeductions += (record.earlyDepartureMinutes / 60) * hourlyRate * 0.5;
            }
        });
        const regularPay = regularHours * hourlyRate;
        const overtimePay = overtimeHours * hourlyRate * 1.5;
        const totalPay = regularPay + overtimePay;
        const netPay = totalPay - lateDeductions - earlyDepartureDeductions;
        return {
            staffId,
            month,
            year,
            totalHours,
            overtimeHours,
            regularHours,
            hourlyRate,
            regularPay,
            overtimePay,
            totalPay,
            lateDeductions,
            earlyDepartureDeductions,
            netPay,
        };
    }
    async getPayrollHistory(staffId, year) {
        const currentYear = year || new Date().getFullYear();
        const payrollRecords = [];
        for (let month = 1; month <= 12; month++) {
            try {
                const payroll = await this.calculatePayroll({
                    staffId,
                    month,
                    year: currentYear,
                });
                payrollRecords.push(payroll);
            }
            catch (error) {
                continue;
            }
        }
        return payrollRecords;
    }
    async getPayrollSummary(staffId, year) {
        const payrollHistory = await this.getPayrollHistory(staffId, year);
        const summary = payrollHistory.reduce((acc, record) => {
            acc.totalHours += record.totalHours;
            acc.overtimeHours += record.overtimeHours;
            acc.regularPay += record.regularPay;
            acc.overtimePay += record.overtimePay;
            acc.totalPay += record.totalPay;
            acc.lateDeductions += record.lateDeductions;
            acc.earlyDepartureDeductions += record.earlyDepartureDeductions;
            acc.netPay += record.netPay;
            acc.monthsWorked++;
            return acc;
        }, {
            totalHours: 0,
            overtimeHours: 0,
            regularPay: 0,
            overtimePay: 0,
            totalPay: 0,
            lateDeductions: 0,
            earlyDepartureDeductions: 0,
            netPay: 0,
            monthsWorked: 0,
            averageMonthlyPay: 0,
        });
        summary.averageMonthlyPay = summary.monthsWorked > 0 ? summary.netPay / summary.monthsWorked : 0;
        return summary;
    }
    async getDepartmentPayrollSummary(department, month, year) {
        const staffList = await this.staffService.findByDepartment(department);
        const departmentPayroll = await Promise.all(staffList.map(async (staff) => {
            try {
                return await this.calculatePayroll({
                    staffId: staff.id,
                    month,
                    year,
                });
            }
            catch (error) {
                return null;
            }
        }));
        const validPayrolls = departmentPayroll.filter(payroll => payroll !== null);
        const summary = validPayrolls.reduce((acc, payroll) => {
            acc.totalStaff++;
            acc.totalHours += payroll.totalHours;
            acc.totalPay += payroll.totalPay;
            acc.totalNetPay += payroll.netPay;
            return acc;
        }, {
            totalStaff: 0,
            totalHours: 0,
            totalPay: 0,
            totalNetPay: 0,
            averagePayPerStaff: 0,
        });
        summary.averagePayPerStaff = summary.totalStaff > 0 ? summary.totalNetPay / summary.totalStaff : 0;
        return summary;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        staff_service_1.StaffService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map