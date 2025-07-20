import { Staff } from '../../users/entities/staff.entity';
import { DeviceType } from './user-device.entity';
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class DeviceRegistrationRequest {
    id: number;
    userId: number;
    deviceId: string;
    deviceName: string;
    deviceType: DeviceType;
    deviceModel: string;
    osVersion: string;
    ipAddress: string;
    requestReason: string;
    status: RequestStatus;
    reviewedBy: number;
    reviewedAt: Date;
    reviewNotes: string;
    createdAt: Date;
    updatedAt: Date;
    user: Staff;
    reviewer: Staff;
}
