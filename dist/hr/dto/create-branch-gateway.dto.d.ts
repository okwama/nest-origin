import { ValidationMethod } from '../entities/branch-gateway.entity';
export declare class CreateBranchGatewayDto {
    branchName: string;
    branchCode: string;
    gatewayIp: string;
    gatewayMac?: string;
    ssid?: string;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
    validationMethod?: ValidationMethod;
    isActive?: boolean;
}
