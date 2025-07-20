export declare enum ValidationMethod {
    IP_ONLY = "ip_only",
    MAC_ONLY = "mac_only",
    IP_AND_MAC = "ip_and_mac",
    IP_AND_SSID = "ip_and_ssid",
    IP_MAC_SSID = "ip_mac_ssid"
}
export declare class BranchGateway {
    id: number;
    branchName: string;
    branchCode: string;
    gatewayIp: string;
    gatewayMac: string;
    ssid: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    validationMethod: ValidationMethod;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
