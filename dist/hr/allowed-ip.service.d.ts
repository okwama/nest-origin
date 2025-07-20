import { Repository } from 'typeorm';
import { AllowedIp } from './entities/allowed-ip.entity';
export declare class AllowedIpService {
    private allowedIpRepository;
    constructor(allowedIpRepository: Repository<AllowedIp>);
    findAll(): Promise<AllowedIp[]>;
    findById(id: number): Promise<AllowedIp>;
    findByIpAddress(ipAddress: string): Promise<AllowedIp>;
    isIpAllowed(ipAddress: string): Promise<boolean>;
    create(ipAddress: string, description?: string): Promise<AllowedIp>;
    update(id: number, data: Partial<AllowedIp>): Promise<AllowedIp>;
    delete(id: number): Promise<void>;
    deactivate(id: number): Promise<AllowedIp>;
    activate(id: number): Promise<AllowedIp>;
}
