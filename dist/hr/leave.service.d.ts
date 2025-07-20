import { Repository, DataSource } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveType } from './entities/leave-type.entity';
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
export declare class LeaveService {
    private leaveRequestRepository;
    private leaveBalanceRepository;
    private leaveTypeRepository;
    private staffService;
    private dataSource;
    constructor(leaveRequestRepository: Repository<LeaveRequest>, leaveBalanceRepository: Repository<LeaveBalance>, leaveTypeRepository: Repository<LeaveType>, staffService: StaffService, dataSource: DataSource);
    createLeaveRequest(createDto: CreateLeaveRequestDto): Promise<any>;
    approveLeaveRequest(requestId: number, approverId: number, notes?: string): Promise<LeaveRequest>;
    rejectLeaveRequest(requestId: number, approverId: number, notes?: string): Promise<LeaveRequest>;
    cancelLeaveRequest(requestId: number): Promise<any>;
    getLeaveRequests(employeeId?: number, status?: LeaveStatus, startDate?: Date, endDate?: Date): Promise<any[]>;
    private calculateDays;
    getLeaveRequestById(id: number): Promise<LeaveRequest>;
    getLeaveBalance(employeeId: number, leaveTypeId: number, year: number): Promise<any>;
    getLeaveBalances(employeeId: number, year: number): Promise<any[]>;
    updateLeaveBalance(leaveRequest: LeaveRequest): Promise<void>;
    getLeaveTypes(): Promise<LeaveType[]>;
    createLeaveType(leaveTypeData: Partial<LeaveType>): Promise<LeaveType>;
    updateLeaveType(id: number, updateData: Partial<LeaveType>): Promise<LeaveType>;
    deleteLeaveType(id: number): Promise<void>;
    getLeaveStats(employeeId?: number, year?: number): Promise<any>;
}
