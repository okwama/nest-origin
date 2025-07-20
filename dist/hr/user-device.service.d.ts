import { Repository } from 'typeorm';
import { UserDevice } from './entities/user-device.entity';
import { RegisterDeviceDto, ValidateDeviceDto } from './dto/register-device.dto';
export declare class UserDeviceService {
    private userDeviceRepository;
    constructor(userDeviceRepository: Repository<UserDevice>);
    registerDevice(userId: number, registerDeviceDto: RegisterDeviceDto): Promise<UserDevice>;
    validateDevice(validateDeviceDto: ValidateDeviceDto): Promise<boolean>;
    getUserDevices(userId: number): Promise<UserDevice[]>;
    getPendingDevices(): Promise<UserDevice[]>;
    getPendingDevicesCount(): Promise<number>;
    updateDeviceStatus(deviceId: number, isActive: boolean): Promise<UserDevice>;
    deleteDevice(deviceId: number): Promise<void>;
    isDeviceApproved(userId: number, deviceId: string): Promise<boolean>;
    getDeviceStats(): Promise<{
        total: number;
        active: number;
        pending: number;
    }>;
    getUserDeviceStats(userId: number): Promise<{
        userId: number;
        total: number;
        active: number;
        pending: number;
        isFirstTimeUser: boolean;
    }>;
}
