"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedIpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const allowed_ip_entity_1 = require("./entities/allowed-ip.entity");
let AllowedIpService = class AllowedIpService {
    constructor(allowedIpRepository) {
        this.allowedIpRepository = allowedIpRepository;
    }
    isIpInCidrRange(ip, cidr) {
        try {
            const [network, bits] = cidr.split('/');
            const mask = parseInt(bits);
            if (isNaN(mask) || mask < 0 || mask > 32) {
                return false;
            }
            const ipNum = this.ipToNumber(ip);
            const networkNum = this.ipToNumber(network);
            if (ipNum === null || networkNum === null) {
                return false;
            }
            const maskNum = mask === 32 ? 0xFFFFFFFF : (0xFFFFFFFF << (32 - mask));
            return (ipNum & maskNum) === (networkNum & maskNum);
        }
        catch (error) {
            console.log(`Error validating CIDR ${cidr}:`, error);
            return false;
        }
    }
    ipToNumber(ip) {
        try {
            const parts = ip.split('.');
            if (parts.length !== 4)
                return null;
            let result = 0;
            for (let i = 0; i < 4; i++) {
                const part = parseInt(parts[i]);
                if (isNaN(part) || part < 0 || part > 255)
                    return null;
                result = (result << 8) + part;
            }
            return result;
        }
        catch (error) {
            return null;
        }
    }
    async findAll() {
        return this.allowedIpRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        return this.allowedIpRepository.findOne({ where: { id } });
    }
    async findByIpAddress(ipAddress) {
        const trimmedIp = ipAddress.trim();
        console.log(`Looking for IP: "${trimmedIp}" (original: "${ipAddress}")`);
        const result = await this.allowedIpRepository.findOne({
            where: { ipAddress: trimmedIp, isActive: true }
        });
        console.log(`Found allowed IP:`, result);
        return result;
    }
    async isIpAllowed(ipAddress) {
        const trimmedIp = ipAddress.trim();
        console.log(`Checking if IP is allowed: "${trimmedIp}"`);
        const allowedIps = await this.allowedIpRepository.find({
            where: { isActive: true }
        });
        const exactMatch = allowedIps.find(ip => ip.ipAddress === trimmedIp);
        if (exactMatch) {
            console.log(`IP "${trimmedIp}" is allowed (exact match)`);
            return true;
        }
        for (const allowedIp of allowedIps) {
            if (allowedIp.ipAddress.includes('/')) {
                try {
                    if (this.isIpInCidrRange(trimmedIp, allowedIp.ipAddress)) {
                        console.log(`IP "${trimmedIp}" is allowed (within range: ${allowedIp.ipAddress})`);
                        return true;
                    }
                }
                catch (error) {
                    console.log(`Error checking CIDR range ${allowedIp.ipAddress}:`, error);
                }
            }
        }
        console.log(`IP "${trimmedIp}" is not allowed`);
        return false;
    }
    async create(ipAddress, description) {
        const trimmedIp = ipAddress.trim();
        const allowedIp = this.allowedIpRepository.create({
            ipAddress: trimmedIp,
            description,
            isActive: true,
        });
        return this.allowedIpRepository.save(allowedIp);
    }
    async update(id, data) {
        await this.allowedIpRepository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.allowedIpRepository.delete(id);
    }
    async deactivate(id) {
        return this.update(id, { isActive: false });
    }
    async activate(id) {
        return this.update(id, { isActive: true });
    }
};
exports.AllowedIpService = AllowedIpService;
exports.AllowedIpService = AllowedIpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(allowed_ip_entity_1.AllowedIp)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AllowedIpService);
//# sourceMappingURL=allowed-ip.service.js.map