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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDevice = exports.DeviceType = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../../users/entities/staff.entity");
var DeviceType;
(function (DeviceType) {
    DeviceType["ANDROID"] = "android";
    DeviceType["IOS"] = "ios";
    DeviceType["WEB"] = "web";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
let UserDevice = class UserDevice {
};
exports.UserDevice = UserDevice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserDevice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserDevice.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', length: 100 }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'device_type',
        type: 'enum',
        enum: DeviceType
    }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_model', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceModel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'os_version', length: 50, nullable: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "osVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'app_version', length: 20, nullable: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "appVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserDevice.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_used', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserDevice.prototype, "lastUsed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserDevice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserDevice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], UserDevice.prototype, "user", void 0);
exports.UserDevice = UserDevice = __decorate([
    (0, typeorm_1.Entity)('user_devices')
], UserDevice);
//# sourceMappingURL=user-device.entity.js.map