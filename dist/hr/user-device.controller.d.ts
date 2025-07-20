import { UserDeviceService } from './user-device.service';
import { RegisterDeviceDto, ValidateDeviceDto } from './dto/register-device.dto';
export declare class UserDeviceController {
    private readonly userDeviceService;
    constructor(userDeviceService: UserDeviceService);
    registerDevice(req: any, registerDeviceDto: RegisterDeviceDto): Promise<import("./entities/user-device.entity").UserDevice>;
    validateDevice(validateDeviceDto: ValidateDeviceDto): Promise<boolean>;
    getUserDevices(req: any): Promise<import("./entities/user-device.entity").UserDevice[]>;
    getPendingDevices(): Promise<import("./entities/user-device.entity").UserDevice[]>;
    getPendingDevicesCount(): Promise<{
        pendingCount: number;
    }>;
    updateDeviceStatus(deviceId: number, body: {
        isActive: boolean;
    }): Promise<import("./entities/user-device.entity").UserDevice>;
    deleteDevice(deviceId: number): Promise<{
        message: string;
    }>;
    getDeviceStats(): Promise<{
        total: number;
        active: number;
        pending: number;
    }>;
    getUserDeviceStats(req: any): Promise<{
        userId: number;
        total: number;
        active: number;
        pending: number;
        isFirstTimeUser: boolean;
    }>;
}
