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
exports.UserDeviceController = void 0;
const common_1 = require("@nestjs/common");
const user_device_service_1 = require("./user-device.service");
const register_device_dto_1 = require("./dto/register-device.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UserDeviceController = class UserDeviceController {
    constructor(userDeviceService) {
        this.userDeviceService = userDeviceService;
    }
    async registerDevice(req, registerDeviceDto) {
        try {
            const userId = req.user.id;
            console.log(`📱 Device registration request: userId=${userId}, deviceId=${registerDeviceDto.deviceId}, deviceType=${registerDeviceDto.deviceType}, deviceName=${registerDeviceDto.deviceName}, deviceModel=${registerDeviceDto.deviceModel}`);
            const result = await this.userDeviceService.registerDevice(userId, registerDeviceDto);
            console.log(`✅ Device registration successful: id=${result.id}`);
            return result;
        }
        catch (error) {
            console.error(`❌ Device registration error: ${error.message}`);
            throw error;
        }
    }
    async validateDevice(validateDeviceDto) {
        try {
            console.log(`🔍 Device validation request: userId=${validateDeviceDto.userId}, deviceId=${validateDeviceDto.deviceId}`);
            const result = await this.userDeviceService.validateDevice(validateDeviceDto);
            console.log(`✅ Device validation successful`);
            return result;
        }
        catch (error) {
            console.error(`❌ Device validation error: ${error.message}`);
            throw error;
        }
    }
    async getUserDevices(req) {
        const userId = req.user.id;
        return await this.userDeviceService.getUserDevices(userId);
    }
    async getPendingDevices() {
        return await this.userDeviceService.getPendingDevices();
    }
    async getPendingDevicesCount() {
        const count = await this.userDeviceService.getPendingDevicesCount();
        return { pendingCount: count };
    }
    async updateDeviceStatus(deviceId, body) {
        return await this.userDeviceService.updateDeviceStatus(deviceId, body.isActive);
    }
    async deleteDevice(deviceId) {
        await this.userDeviceService.deleteDevice(deviceId);
        return { message: 'Device deleted successfully' };
    }
    async getDeviceStats() {
        return await this.userDeviceService.getDeviceStats();
    }
    async getUserDeviceStats(req) {
        const userId = req.user.id;
        return await this.userDeviceService.getUserDeviceStats(userId);
    }
};
exports.UserDeviceController = UserDeviceController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_device_dto_1.RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "registerDevice", null);
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_device_dto_1.ValidateDeviceDto]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "validateDevice", null);
__decorate([
    (0, common_1.Get)('my-devices'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "getUserDevices", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "getPendingDevices", null);
__decorate([
    (0, common_1.Get)('pending/count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "getPendingDevicesCount", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "updateDeviceStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "deleteDevice", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "getDeviceStats", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "getUserDeviceStats", null);
exports.UserDeviceController = UserDeviceController = __decorate([
    (0, common_1.Controller)('hr/devices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_device_service_1.UserDeviceService])
], UserDeviceController);
//# sourceMappingURL=user-device.controller.js.map