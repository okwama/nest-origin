import { AllowedIpService } from './allowed-ip.service';
import { CreateAllowedIpDto } from './dto/create-allowed-ip.dto';
export declare class AllowedIpController {
    private readonly allowedIpService;
    constructor(allowedIpService: AllowedIpService);
    findAll(): Promise<import("./entities/allowed-ip.entity").AllowedIp[]>;
    checkIp(ipAddress: string): Promise<{
        ipAddress: string;
        isAllowed: boolean;
        message: string;
    }>;
    create(createAllowedIpDto: CreateAllowedIpDto): Promise<import("./entities/allowed-ip.entity").AllowedIp>;
}
