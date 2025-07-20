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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRegistrationRequest = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../../users/entities/staff.entity");
const user_device_entity_1 = require("./user-device.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let DeviceRegistrationRequest = class DeviceRegistrationRequest {
};
exports.DeviceRegistrationRequest = DeviceRegistrationRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceRegistrationRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], DeviceRegistrationRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', length: 100 }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'device_type',
        type: 'enum',
        enum: user_device_entity_1.DeviceType
    }),
    __metadata("design:type", typeof (_a = typeof user_device_entity_1.DeviceType !== "undefined" && user_device_entity_1.DeviceType) === "function" ? _a : Object)
], DeviceRegistrationRequest.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_model', length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "deviceModel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'os_version', length: 50, nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "osVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "requestReason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING
    }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_by', nullable: true }),
    __metadata("design:type", Number)
], DeviceRegistrationRequest.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_at', nullable: true }),
    __metadata("design:type", Date)
], DeviceRegistrationRequest.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceRegistrationRequest.prototype, "reviewNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeviceRegistrationRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DeviceRegistrationRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], DeviceRegistrationRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewed_by' }),
    __metadata("design:type", staff_entity_1.Staff)
], DeviceRegistrationRequest.prototype, "reviewer", void 0);
exports.DeviceRegistrationRequest = DeviceRegistrationRequest = __decorate([
    (0, typeorm_1.Entity)('device_registration_requests')
], DeviceRegistrationRequest);
//# sourceMappingURL=device-registration-request.entity.js.map