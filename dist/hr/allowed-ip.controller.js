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
exports.AllowedIpController = void 0;
const common_1 = require("@nestjs/common");
const allowed_ip_service_1 = require("./allowed-ip.service");
const create_allowed_ip_dto_1 = require("./dto/create-allowed-ip.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let AllowedIpController = class AllowedIpController {
    constructor(allowedIpService) {
        this.allowedIpService = allowedIpService;
    }
    async findAll() {
        return await this.allowedIpService.findAll();
    }
    async checkIp(ipAddress) {
        const isAllowed = await this.allowedIpService.isIpAllowed(ipAddress);
        return {
            ipAddress,
            isAllowed,
            message: isAllowed ? 'IP is allowed' : 'IP is not allowed'
        };
    }
    async create(createAllowedIpDto) {
        try {
            return await this.allowedIpService.create(createAllowedIpDto.ipAddress, createAllowedIpDto.description);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.HttpException('IP address already exists', common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
};
exports.AllowedIpController = AllowedIpController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AllowedIpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('check/:ipAddress'),
    __param(0, (0, common_1.Param)('ipAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AllowedIpController.prototype, "checkIp", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_allowed_ip_dto_1.CreateAllowedIpDto]),
    __metadata("design:returntype", Promise)
], AllowedIpController.prototype, "create", null);
exports.AllowedIpController = AllowedIpController = __decorate([
    (0, common_1.Controller)('hr/allowed-ips'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [allowed_ip_service_1.AllowedIpService])
], AllowedIpController);
//# sourceMappingURL=allowed-ip.controller.js.map