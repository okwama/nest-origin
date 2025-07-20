import { Repository, DataSource } from 'typeorm';
import { UserDevice } from './entities/user-device.entity';
import { DeviceRegistrationRequest } from './entities/device-registration-request.entity';
import { RegisterDeviceDto, ValidateDeviceDto, ApproveDeviceDto } from './dto/register-device.dto';
export declare class DeviceService {
    private userDeviceRepository;
    private deviceRequestRepository;
    private dataSource;
    constructor(userDeviceRepository: Repository<UserDevice>, deviceRequestRepository: Repository<DeviceRegistrationRequest>, dataSource: DataSource);
    registerDevice(registerDeviceDto: RegisterDeviceDto): Promise<DeviceRegistrationRequest>;
    validateDevice(validateDeviceDto: ValidateDeviceDto): Promise<{
        isValid: boolean;
        deviceName?: string;
    }>;
    approveDevice(approveDeviceDto: ApproveDeviceDto): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectDevice(approveDeviceDto: ApproveDeviceDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getPendingRequests(): Promise<DeviceRegistrationRequest[]>;
    getUserDevices(userId: number): Promise<UserDevice[]>;
    deactivateDevice(deviceId: string, userId: number): Promise<void>;
    getDeviceApprovalDashboard(): Promise<any[]>;
}
