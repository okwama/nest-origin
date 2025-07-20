import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveType } from './entities/leave-type.entity';
import { Staff } from '../users/entities/staff.entity';
import { StaffService } from '../users/staff.service';

export interface CreateLeaveRequestDto {
  employeeId: number;
  leaveTypeId: number;
  startDate: Date;
  endDate: Date;
  isHalfDay?: boolean;
  reason?: string;
  attachmentUrl?: string;
}

export interface UpdateLeaveRequestDto {
  status?: LeaveStatus;
  approvedBy?: number;
  notes?: string;
}

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepository: Repository<LeaveBalance>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    private staffService: StaffService,
    private dataSource: DataSource,
  ) {}

  async createLeaveRequest(createDto: CreateLeaveRequestDto): Promise<any> {
    const { employeeId, leaveTypeId, startDate, endDate, reason, isHalfDay, attachmentUrl } = createDto;

    // Validate dates
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check if leave type exists
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } });
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    // Check if employee exists
    const employee = await this.staffService.findOne(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Create the leave request
    const leaveRequest = this.leaveRequestRepository.create({
      employeeId,
      leaveTypeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || '',
      status: LeaveStatus.PENDING,
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

  async approveLeaveRequest(requestId: number, approverId: number, notes?: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.APPROVED;
    leaveRequest.approvedBy = approverId;
    leaveRequest.updatedAt = new Date();

    // Update leave balance
    await this.updateLeaveBalance(leaveRequest);

    return this.leaveRequestRepository.save(leaveRequest);
  }

  async rejectLeaveRequest(requestId: number, approverId: number, notes?: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.REJECTED;
    leaveRequest.approvedBy = approverId;
    leaveRequest.updatedAt = new Date();

    return this.leaveRequestRepository.save(leaveRequest);
  }

  async cancelLeaveRequest(requestId: number): Promise<any> {
    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be cancelled');
    }

    leaveRequest.status = LeaveStatus.CANCELLED;
    leaveRequest.updatedAt = new Date();

    const savedRequest = await this.leaveRequestRepository.save(leaveRequest);
    
    return {
      success: true,
      id: savedRequest.id,
      message: 'Leave request cancelled successfully',
      data: savedRequest
    };
  }

  async getLeaveRequests(
    employeeId?: number,
    status?: LeaveStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
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

    // Get leave types for all requests
    const leaveTypeIds = [...new Set(leaveRequests.map(r => r.leaveTypeId))];
    const leaveTypes = await this.leaveTypeRepository.find({
      where: leaveTypeIds.map(id => ({ id }))
    });
    const leaveTypeMap = new Map(leaveTypes.map(lt => [lt.id, lt]));

    // Transform to match expected format
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
        approverName: null, // Will be added when approval is implemented
        totalDaysRequested: this.calculateDays(request.startDate, request.endDate, request.isHalfDay),
      };
    });
  }

  private calculateDays(startDate: Date | string, endDate: Date | string, isHalfDay: boolean): number {
    // Ensure dates are Date objects
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    return isHalfDay ? daysDiff * 0.5 : daysDiff;
  }

  async getLeaveRequestById(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['employee', 'approver'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    return leaveRequest;
  }

  async getLeaveBalance(employeeId: number, leaveTypeId: number, year: number): Promise<any> {
    // Get leave balance from database
    const leaveBalance = await this.leaveBalanceRepository.findOne({
      where: {
        employeeId,
        leaveTypeId,
        year,
      },
    });

    // Get leave type
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } });

    if (!leaveBalance) {
      // Return default balance if not found
      return {
        id: 0,
        employeeId,
        leaveTypeId,
        year,
        totalDays: 21, // Default annual leave
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

  async getLeaveBalances(employeeId: number, year: number): Promise<any[]> {
    const leaveTypes = await this.leaveTypeRepository.find();
    const balances = [];

    for (const leaveType of leaveTypes) {
      const balance = await this.getLeaveBalance(employeeId, leaveType.id, year);
      balances.push(balance);
    }

    return balances;
  }

  async updateLeaveBalance(leaveRequest: LeaveRequest): Promise<void> {
    const daysDiff = Math.ceil(
      (leaveRequest.endDate.getTime() - leaveRequest.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
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

  async getLeaveTypes(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find();
  }

  async createLeaveType(leaveTypeData: Partial<LeaveType>): Promise<LeaveType> {
    const leaveType = this.leaveTypeRepository.create(leaveTypeData);
    return this.leaveTypeRepository.save(leaveType);
  }

  async updateLeaveType(id: number, updateData: Partial<LeaveType>): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id } });
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    Object.assign(leaveType, updateData);
    return this.leaveTypeRepository.save(leaveType);
  }

  async deleteLeaveType(id: number): Promise<void> {
    const result = await this.leaveTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave type not found');
    }
  }

  async getLeaveStats(employeeId?: number, year?: number): Promise<any> {
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
        pending: LeaveStatus.PENDING,
        approved: LeaveStatus.APPROVED,
        rejected: LeaveStatus.REJECTED,
      })
      .getRawOne();

    return {
      totalRequests: parseInt(stats.totalRequests) || 0,
      pendingRequests: parseInt(stats.pendingRequests) || 0,
      approvedRequests: parseInt(stats.approvedRequests) || 0,
      rejectedRequests: parseInt(stats.rejectedRequests) || 0,
    };
  }
} 