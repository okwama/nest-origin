export declare class CreateLeaveRequestDto {
    employeeId?: number;
    leaveTypeId: number;
    startDate: Date;
    endDate: Date;
    isHalfDay?: boolean;
    reason?: string;
    attachmentUrl?: string;
}
