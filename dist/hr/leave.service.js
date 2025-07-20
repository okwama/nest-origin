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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_request_entity_1 = require("./entities/leave-request.entity");
const leave_balance_entity_1 = require("./entities/leave-balance.entity");
const leave_type_entity_1 = require("./entities/leave-type.entity");
const staff_service_1 = require("../users/staff.service");
let LeaveService = class LeaveService {
    constructor(leaveRequestRepository, leaveBalanceRepository, leaveTypeRepository, staffService, dataSource) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.staffService = staffService;
        this.dataSource = dataSource;
    }
    async createLeaveRequest(createDto) {
        const { employeeId, leaveTypeId, startDate, endDate, reason, isHalfDay, attachmentUrl } = createDto;
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } });
        if (!leaveType) {
            throw new common_1.NotFoundException('Leave type not found');
        }
        const employee = await this.staffService.findOne(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const leaveRequest = this.leaveRequestRepository.create({
            employeeId,
            leaveTypeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason: reason || '',
            status: leave_request_entity_1.LeaveStatus.PENDING,
            isHalfDay: isHalfDay || false,
            attachmentUrl: attachmentUrl || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedRequest = await this.leaveRequestRepository.save(leaveRequest);
        return {
            success: true,
            id: savedRequest.id,
            message: 'Leave request created successfully',
            data: savedRequest
        };
    }
    async approveLeaveRequest(requestId, approverId, notes) {
        const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (leaveRequest.status !== leave_request_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Leave request is not pending');
        }
        leaveRequest.status = leave_request_entity_1.LeaveStatus.APPROVED;
        leaveRequest.approvedBy = approverId;
        leaveRequest.updatedAt = new Date();
        await this.updateLeaveBalance(leaveRequest);
        return this.leaveRequestRepository.save(leaveRequest);
    }
    async rejectLeaveRequest(requestId, approverId, notes) {
        const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (leaveRequest.status !== leave_request_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Leave request is not pending');
        }
        leaveRequest.status = leave_request_entity_1.LeaveStatus.REJECTED;
        leaveRequest.approvedBy = approverId;
        leaveRequest.updatedAt = new Date();
        return this.leaveRequestRepository.save(leaveRequest);
    }
    async cancelLeaveRequest(requestId) {
        const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (leaveRequest.status !== leave_request_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending leave requests can be cancelled');
        }
        leaveRequest.status = leave_request_entity_1.LeaveStatus.CANCELLED;
        leaveRequest.updatedAt = new Date();
        const savedRequest = await this.leaveRequestRepository.save(leaveRequest);
        return {
            success: true,
            id: savedRequest.id,
            message: 'Leave request cancelled successfully',
            data: savedRequest
        };
    }
    async getLeaveRequests(employeeId, status, startDate, endDate) {
        const queryBuilder = this.leaveRequestRepository
            .createQueryBuilder('leaveRequest')
            .leftJoinAndSelect('leaveRequest.staff', 'staff');
        if (employeeId) {
            queryBuilder.andWhere('leaveRequest.employeeId = :employeeId', { employeeId });
        }
        if (status) {
            queryBuilder.andWhere('leaveRequest.status = :status', { status });
        }
        if (startDate) {
            queryBuilder.andWhere('leaveRequest.startDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('leaveRequest.endDate <= :endDate', { endDate });
        }
        queryBuilder.orderBy('leaveRequest.createdAt', 'DESC');
        const leaveRequests = await queryBuilder.getMany();
        const leaveTypeIds = [...new Set(leaveRequests.map(r => r.leaveTypeId))];
        const leaveTypes = await this.leaveTypeRepository.find({
            where: leaveTypeIds.map(id => ({ id }))
        });
        const leaveTypeMap = new Map(leaveTypes.map(lt => [lt.id, lt]));
        return leaveRequests.map(request => {
            const leaveType = leaveTypeMap.get(request.leaveTypeId);
            return {
                id: request.id,
                employeeId: request.employeeId,
                leaveTypeId: request.leaveTypeId,
                startDate: request.startDate,
                endDate: request.endDate,
                reason: request.reason,
                status: request.status,
                isHalfDay: request.isHalfDay,
                attachmentUrl: request.attachmentUrl,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt,
                leaveTypeName: leaveType?.name,
                leaveTypeDescription: leaveType?.description,
                employeeName: request.staff?.name,
                employeeEmail: request.staff?.businessEmail,
                approverName: null,
                totalDaysRequested: this.calculateDays(request.startDate, request.endDate, request.isHalfDay),
            };
        });
    }
    calculateDays(startDate, endDate, isHalfDay) {
        const start = startDate instanceof Date ? startDate : new Date(startDate);
        const end = endDate instanceof Date ? endDate : new Date(endDate);
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return isHalfDay ? daysDiff * 0.5 : daysDiff;
    }
    async getLeaveRequestById(id) {
        const leaveRequest = await this.leaveRequestRepository.findOne({
            where: { id },
            relations: ['employee', 'approver'],
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        return leaveRequest;
    }
    async getLeaveBalance(employeeId, leaveTypeId, year) {
        const leaveBalance = await this.leaveBalanceRepository.findOne({
            where: {
                employeeId,
                leaveTypeId,
                year,
            },
        });
        const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } });
        if (!leaveBalance) {
            return {
                id: 0,
                employeeId,
                leaveTypeId,
                year,
                totalDays: 21,
                usedDays: 0,
                remainingDays: 21,
                availableDays: 21,
                leaveTypeName: leaveType?.name,
                leaveTypeDescription: leaveType?.description,
            };
        }
        return {
            id: leaveBalance.id,
            employeeId: leaveBalance.employeeId,
            leaveTypeId: leaveBalance.leaveTypeId,
            year: leaveBalance.year,
            totalDays: Number(leaveBalance.totalDays),
            usedDays: Number(leaveBalance.usedDays),
            remainingDays: Number(leaveBalance.remainingDays),
            availableDays: Number(leaveBalance.remainingDays),
            leaveTypeName: leaveType?.name,
            leaveTypeDescription: leaveType?.description,
        };
    }
    async getLeaveBalances(employeeId, year) {
        const leaveTypes = await this.leaveTypeRepository.find();
        const balances = [];
        for (const leaveType of leaveTypes) {
            const balance = await this.getLeaveBalance(employeeId, leaveType.id, year);
            balances.push(balance);
        }
        return balances;
    }
    async updateLeaveBalance(leaveRequest) {
        const daysDiff = Math.ceil((leaveRequest.endDate.getTime() - leaveRequest.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const leaveDays = leaveRequest.isHalfDay ? daysDiff * 0.5 : daysDiff;
        const currentYear = new Date().getFullYear();
        const leaveBalance = await this.leaveBalanceRepository.findOne({
            where: {
                employeeId: leaveRequest.employeeId,
                leaveTypeId: leaveRequest.leaveTypeId,
                year: currentYear,
            },
        });
        if (leaveBalance) {
            leaveBalance.usedDays += leaveDays;
            leaveBalance.remainingDays = leaveBalance.totalDays - leaveBalance.usedDays;
            await this.leaveBalanceRepository.save(leaveBalance);
        }
    }
    async getLeaveTypes() {
        return this.leaveTypeRepository.find();
    }
    async createLeaveType(leaveTypeData) {
        const leaveType = this.leaveTypeRepository.create(leaveTypeData);
        return this.leaveTypeRepository.save(leaveType);
    }
    async updateLeaveType(id, updateData) {
        const leaveType = await this.leaveTypeRepository.findOne({ where: { id } });
        if (!leaveType) {
            throw new common_1.NotFoundException('Leave type not found');
        }
        Object.assign(leaveType, updateData);
        return this.leaveTypeRepository.save(leaveType);
    }
    async deleteLeaveType(id) {
        const result = await this.leaveTypeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Leave type not found');
        }
    }
    async getLeaveStats(employeeId, year) {
        const currentYear = year || new Date().getFullYear();
        const queryBuilder = this.leaveRequestRepository.createQueryBuilder('leaveRequest');
        if (employeeId) {
            queryBuilder.where('leaveRequest.employeeId = :employeeId', { employeeId });
        }
        queryBuilder.andWhere('YEAR(leaveRequest.startDate) = :year', { year: currentYear });
        const stats = await queryBuilder
            .select([
            'COUNT(*) as totalRequests',
            'SUM(CASE WHEN leaveRequest.status = :pending THEN 1 ELSE 0 END) as pendingRequests',
            'SUM(CASE WHEN leaveRequest.status = :approved THEN 1 ELSE 0 END) as approvedRequests',
            'SUM(CASE WHEN leaveRequest.status = :rejected THEN 1 ELSE 0 END) as rejectedRequests',
        ])
            .setParameters({
            pending: leave_request_entity_1.LeaveStatus.PENDING,
            approved: leave_request_entity_1.LeaveStatus.APPROVED,
            rejected: leave_request_entity_1.LeaveStatus.REJECTED,
        })
            .getRawOne();
        return {
            totalRequests: parseInt(stats.totalRequests) || 0,
            pendingRequests: parseInt(stats.pendingRequests) || 0,
            approvedRequests: parseInt(stats.approvedRequests) || 0,
            rejectedRequests: parseInt(stats.rejectedRequests) || 0,
        };
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(leave_balance_entity_1.LeaveBalance)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        staff_service_1.StaffService,
        typeorm_2.DataSource])
], LeaveService);
//# sourceMappingURL=leave.service.js.map