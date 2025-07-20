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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_device_entity_1 = require("./entities/user-device.entity");
const device_registration_request_entity_1 = require("./entities/device-registration-request.entity");
let DeviceService = class DeviceService {
    constructor(userDeviceRepository, deviceRequestRepository, dataSource) {
        this.userDeviceRepository = userDeviceRepository;
        this.deviceRequestRepository = deviceRequestRepository;
        this.dataSource = dataSource;
    }
    async registerDevice(registerDeviceDto) {
        const { staffId, deviceId } = registerDeviceDto;
        const existingDevice = await this.userDeviceRepository.findOne({
            where: { userId: staffId, deviceId, isApproved: true, isActive: true }
        });
        if (existingDevice) {
            throw new common_1.ConflictException('Device is already registered and approved');
        }
        const existingRequest = await this.deviceRequestRepository.findOne({
            where: { userId: staffId, deviceId, status: device_registration_request_entity_1.RequestStatus.PENDING }
        });
        if (existingRequest) {
            throw new common_1.ConflictException('Device registration request already pending');
        }
        const deviceRequest = this.deviceRequestRepository.create({
            ...registerDeviceDto,
            status: device_registration_request_entity_1.RequestStatus.PENDING,
        });
        return await this.deviceRequestRepository.save(deviceRequest);
    }
    async validateDevice(validateDeviceDto) {
        const { staffId, deviceId } = validateDeviceDto;
        const result = await this.dataSource.query('CALL ValidateDevice(?, ?)', [staffId, deviceId]);
        if (result && result[0] && result[0].length > 0) {
            const validation = result[0][0];
            return {
                isValid: validation.is_valid === 1,
                deviceName: validation.device_name
            };
        }
        return { isValid: false };
    }
    async approveDevice(approveDeviceDto) {
        const { requestId, reviewerId, notes } = approveDeviceDto;
        const result = await this.dataSource.query('CALL ApproveDevice(?, ?, ?, ?)', [requestId, reviewerId, true, notes]);
        if (result && result[0] && result[0].length > 0) {
            const response = result[0][0];
            return {
                success: response.result === 'Success',
                message: response.result
            };
        }
        throw new common_1.NotFoundException('Failed to approve device');
    }
    async rejectDevice(approveDeviceDto) {
        const { requestId, reviewerId, notes } = approveDeviceDto;
        const result = await this.dataSource.query('CALL ApproveDevice(?, ?, ?, ?)', [requestId, reviewerId, false, notes]);
        if (result && result[0] && result[0].length > 0) {
            const response = result[0][0];
            return {
                success: response.result === 'Success',
                message: response.result
            };
        }
        throw new common_1.NotFoundException('Failed to reject device');
    }
    async getPendingRequests() {
        return await this.deviceRequestRepository.find({
            where: { status: device_registration_request_entity_1.RequestStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async getUserDevices(userId) {
        return await this.userDeviceRepository.find({
            where: { userId, isActive: true },
            relations: ['user', 'approver'],
            order: { createdAt: 'DESC' }
        });
    }
    async deactivateDevice(deviceId, userId) {
        const device = await this.userDeviceRepository.findOne({
            where: { deviceId, userId, isActive: true }
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        device.isActive = false;
        await this.userDeviceRepository.save(device);
    }
    async getDeviceApprovalDashboard() {
        return await this.dataSource.query('SELECT * FROM device_approval_dashboard');
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_device_entity_1.UserDevice)),
    __param(1, (0, typeorm_1.InjectRepository)(device_registration_request_entity_1.DeviceRegistrationRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], DeviceService);
//# sourceMappingURL=device.service.js.map