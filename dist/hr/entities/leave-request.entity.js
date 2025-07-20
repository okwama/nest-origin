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
exports.LeaveRequest = exports.LeaveStatus = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../../users/entities/staff.entity");
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
    LeaveStatus["CANCELLED"] = "cancelled";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
let LeaveRequest = class LeaveRequest {
};
exports.LeaveRequest = LeaveRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_type_id' }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "leaveTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_half_day', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], LeaveRequest.prototype, "isHalfDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: LeaveStatus.PENDING,
    }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_type_id', default: 1 }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "employeeTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], LeaveRequest.prototype, "staff", void 0);
exports.LeaveRequest = LeaveRequest = __decorate([
    (0, typeorm_1.Entity)('leave_requests'),
    (0, typeorm_1.Index)(['employeeId', 'leaveTypeId', 'startDate', 'endDate'], { unique: true }),
    (0, typeorm_1.Index)(['employeeId', 'leaveTypeId', 'status'])
], LeaveRequest);
//# sourceMappingURL=leave-request.entity.js.map