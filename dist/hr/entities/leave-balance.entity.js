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
exports.LeaveBalance = void 0;
const typeorm_1 = require("typeorm");
let LeaveBalance = class LeaveBalance {
};
exports.LeaveBalance = LeaveBalance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_type_id' }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "leaveTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_days', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "totalDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'used_days', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "usedDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remaining_days', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "remainingDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carried_over_days', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "carriedOverDays", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LeaveBalance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LeaveBalance.prototype, "updatedAt", void 0);
exports.LeaveBalance = LeaveBalance = __decorate([
    (0, typeorm_1.Entity)('leave_balances'),
    (0, typeorm_1.Index)(['employeeId', 'leaveTypeId', 'year'], { unique: true }),
    (0, typeorm_1.Index)(['employeeId', 'year'])
], LeaveBalance);
//# sourceMappingURL=leave-balance.entity.js.map