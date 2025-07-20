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
exports.UserDeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_device_entity_1 = require("./entities/user-device.entity");
let UserDeviceService = class UserDeviceService {
    constructor(userDeviceRepository) {
        this.userDeviceRepository = userDeviceRepository;
    }
    async registerDevice(userId, registerDeviceDto) {
        try {
            console.log(`📱 Registering device: userId=${userId}, deviceId=${registerDeviceDto.deviceId}, deviceName=${registerDeviceDto.deviceName}, deviceModel=${registerDeviceDto.deviceModel}`);
            const existingDevice = await this.userDeviceRepository.findOne({
                where: { userId, deviceId: registerDeviceDto.deviceId }
            });
            if (existingDevice) {
                console.log(`📱 Updating existing device: id=${existingDevice.id}`);
                existingDevice.deviceName = registerDeviceDto.deviceName || existingDevice.deviceName;
                existingDevice.deviceModel = registerDeviceDto.deviceModel || existingDevice.deviceModel;
                existingDevice.osVersion = registerDeviceDto.osVersion || existingDevice.osVersion;
                existingDevice.appVersion = registerDeviceDto.appVersion || existingDevice.appVersion;
                existingDevice.ipAddress = registerDeviceDto.ipAddress || existingDevice.ipAddress;
                return await this.userDeviceRepository.save(existingDevice);
            }
            const existingDevicesCount = await this.userDeviceRepository.count({
                where: { userId }
            });
            const isAutoApproved = existingDevicesCount === 0;
            if (isAutoApproved) {
                console.log(`🎉 First-time user detected! Auto-approving device for userId=${userId}`);
            }
            else {
                console.log(`📱 Registered user adding new device: userId=${userId}, existingDevices=${existingDevicesCount}, requiresAdminApproval=true`);
            }
            const newDevice = this.userDeviceRepository.create({
                userId,
                ...registerDeviceDto,
                isActive: isAutoApproved,
            });
            const savedDevice = await this.userDeviceRepository.save(newDevice);
            console.log(`✅ Device registered successfully: id=${savedDevice.id}, isActive=${savedDevice.isActive}`);
            return savedDevice;
        }
        catch (error) {
            console.error(`❌ Device registration failed: ${error.message}`);
            throw new Error(`Failed to register device: ${error.message}`);
        }
    }
    async validateDevice(validateDeviceDto) {
        const { userId, deviceId, ipAddress } = validateDeviceDto;
        console.log(`🔍 Validating device: userId=${userId}, deviceId=${deviceId}`);
        const device = await this.userDeviceRepository.findOne({
            where: { userId, deviceId }
        });
        if (!device) {
            console.log(`❌ Device not found: userId=${userId}, deviceId=${deviceId}`);
            const existingDevicesCount = await this.userDeviceRepository.count({
                where: { userId }
            });
            if (existingDevicesCount === 0) {
                console.log(`🎉 First-time user detected! Auto-registering device for userId=${userId}`);
                try {
                    const autoRegisterDto = {
                        deviceId,
                        deviceName: 'Auto-registered Device',
                        deviceType: (deviceId.startsWith('ios_') ? 'ios' :
                            deviceId.startsWith('android_') ? 'android' : 'web'),
                        deviceModel: 'Unknown',
                        osVersion: 'Unknown',
                        appVersion: '1.0.0',
                        ipAddress,
                    };
                    const newDevice = await this.registerDevice(userId, autoRegisterDto);
                    console.log(`✅ Auto-registered device: id=${newDevice.id}, isActive=${newDevice.isActive}`);
                    newDevice.lastUsed = new Date();
                    await this.userDeviceRepository.save(newDevice);
                    console.log(`✅ Device validation successful after auto-registration: deviceId=${deviceId}`);
                    return true;
                }
                catch (autoRegError) {
                    console.error(`❌ Auto-registration failed: ${autoRegError.message}`);
                    throw new common_1.ForbiddenException('Device not registered. Please contact HR.');
                }
            }
            else {
                console.log(`📱 Registered user with existing devices: userId=${userId}, existingDevices=${existingDevicesCount}`);
                throw new common_1.ForbiddenException('This device is not registered. Please contact your administrator to register this device.');
            }
            throw new common_1.ForbiddenException('Device not registered. Please contact HR.');
        }
        console.log(`📱 Device found: id=${device.id}, isActive=${device.isActive}`);
        if (!device.isActive) {
            console.log(`❌ Device not approved: deviceId=${deviceId}, userId=${userId}`);
            throw new common_1.ForbiddenException('This device is not approved for check-in. Please contact your administrator to approve this device.');
        }
        device.lastUsed = new Date();
        if (ipAddress) {
            device.ipAddress = ipAddress;
        }
        await this.userDeviceRepository.save(device);
        console.log(`✅ Device validation successful: deviceId=${deviceId}`);
        return true;
    }
    async getUserDevices(userId) {
        return await this.userDeviceRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async getPendingDevices() {
        return await this.userDeviceRepository.find({
            where: { isActive: false },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async getPendingDevicesCount() {
        return await this.userDeviceRepository.count({
            where: { isActive: false }
        });
    }
    async updateDeviceStatus(deviceId, isActive) {
        const device = await this.userDeviceRepository.findOne({
            where: { id: deviceId }
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        device.isActive = isActive;
        return await this.userDeviceRepository.save(device);
    }
    async deleteDevice(deviceId) {
        const device = await this.userDeviceRepository.findOne({
            where: { id: deviceId }
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        await this.userDeviceRepository.remove(device);
    }
    async isDeviceApproved(userId, deviceId) {
        const device = await this.userDeviceRepository.findOne({
            where: { userId, deviceId }
        });
        return device?.isActive ?? false;
    }
    async getDeviceStats() {
        const totalDevices = await this.userDeviceRepository.count();
        const activeDevices = await this.userDeviceRepository.count({ where: { isActive: true } });
        const pendingDevices = await this.userDeviceRepository.count({ where: { isActive: false } });
        return {
            total: totalDevices,
            active: activeDevices,
            pending: pendingDevices
        };
    }
    async getUserDeviceStats(userId) {
        const totalDevices = await this.userDeviceRepository.count({ where: { userId } });
        const activeDevices = await this.userDeviceRepository.count({ where: { userId, isActive: true } });
        const pendingDevices = await this.userDeviceRepository.count({ where: { userId, isActive: false } });
        return {
            userId,
            total: totalDevices,
            active: activeDevices,
            pending: pendingDevices,
            isFirstTimeUser: totalDevices === 0
        };
    }
};
exports.UserDeviceService = UserDeviceService;
exports.UserDeviceService = UserDeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_device_entity_1.UserDevice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserDeviceService);
//# sourceMappingURL=user-device.service.js.map