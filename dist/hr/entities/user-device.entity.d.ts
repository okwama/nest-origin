import { Staff } from '../../users/entities/staff.entity';
export declare enum DeviceType {
    ANDROID = "android",
    IOS = "ios",
    WEB = "web"
}
export declare class UserDevice {
    id: number;
    userId: number;
    deviceId: string;
    deviceName: string;
    deviceType: DeviceType;
    deviceModel: string;
    osVersion: string;
    appVersion: string;
    ipAddress: string;
    isActive: boolean;
    lastUsed: Date;
    createdAt: Date;
    updatedAt: Date;
    user: Staff;
}
