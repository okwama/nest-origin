import { Staff } from '../../users/entities/staff.entity';
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled"
}
export declare class LeaveRequest {
    id: number;
    employeeId: number;
    leaveTypeId: number;
    startDate: Date;
    endDate: Date;
    isHalfDay: boolean;
    reason: string;
    attachmentUrl: string;
    status: LeaveStatus;
    approvedBy: number;
    employeeTypeId: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    appliedAt: Date;
    staff: Staff;
}
