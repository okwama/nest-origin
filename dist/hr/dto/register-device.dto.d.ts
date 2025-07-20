import { DeviceType } from '../entities/user-device.entity';
export declare class RegisterDeviceDto {
    deviceId: string;
    deviceName?: string;
    deviceType: DeviceType;
    deviceModel?: string;
    osVersion?: string;
    appVersion?: string;
    ipAddress?: string;
}
export declare class ValidateDeviceDto {
    userId: number;
    deviceId: string;
    ipAddress?: string;
}
