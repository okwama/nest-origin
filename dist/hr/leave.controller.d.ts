import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { LeaveType } from './entities/leave-type.entity';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    createLeaveRequest(createDto: CreateLeaveRequestDto, req: any): Promise<LeaveRequest>;
    approveLeaveRequest(id: number, body: {
        notes?: string;
    }, req: any): Promise<LeaveRequest>;
    rejectLeaveRequest(id: number, body: {
        notes?: string;
    }, req: any): Promise<LeaveRequest>;
    cancelLeaveRequest(id: number, req: any): Promise<any>;
    getLeaveRequests(req: any, employeeId?: string, status?: LeaveStatus, startDate?: string, endDate?: string): Promise<LeaveRequest[]>;
    getLeaveRequestById(id: number, req: any): Promise<LeaveRequest>;
    getLeaveBalance(employeeId: number, req: any, leaveTypeId: string, year: string): Promise<any>;
    getLeaveBalances(employeeId: number, req: any, year: string): Promise<any[]>;
    getLeaveTypes(): Promise<LeaveType[]>;
    createLeaveType(leaveTypeData: Partial<LeaveType>): Promise<LeaveType>;
    updateLeaveType(id: number, updateData: Partial<LeaveType>): Promise<LeaveType>;
    deleteLeaveType(id: number): Promise<void>;
    getLeaveStats(req: any, employeeId?: string, year?: string): Promise<any>;
    getMyLeaveRequests(req: any, status?: LeaveStatus, startDate?: string, endDate?: string): Promise<LeaveRequest[]>;
    getMyLeaveBalances(req: any, year: string): Promise<any[]>;
    getMyLeaveStats(req: any, year: string): Promise<any>;
}
