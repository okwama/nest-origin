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
exports.Staff = exports.StaffStatus = exports.StaffRole = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcryptjs");
var StaffRole;
(function (StaffRole) {
    StaffRole["STAFF"] = "staff";
    StaffRole["MANAGER"] = "manager";
    StaffRole["ADMIN"] = "admin";
})(StaffRole || (exports.StaffRole = StaffRole = {}));
var StaffStatus;
(function (StaffStatus) {
    StaffStatus["ACTIVE"] = "active";
    StaffStatus["INACTIVE"] = "inactive";
    StaffStatus["SUSPENDED"] = "suspended";
})(StaffStatus || (exports.StaffStatus = StaffStatus = {}));
let Staff = class Staff {
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }
    async validatePassword(password) {
        if (!this.password) {
            return false;
        }
        try {
            return await bcrypt.compare(password, this.password);
        }
        catch (error) {
            console.error('❌ Error in bcrypt.compare:', error);
            return false;
        }
    }
    isActive() {
        return this.isActiveField === 1;
    }
    get email() {
        return this.businessEmail || this.departmentEmail || '';
    }
    get phone() {
        return this.phoneNumber || '';
    }
    get status() {
        return this.isActiveField === 1 ? StaffStatus.ACTIVE : StaffStatus.INACTIVE;
    }
    get staffRole() {
        return this.role === 'admin' ? StaffRole.ADMIN :
            this.role === 'manager' ? StaffRole.MANAGER : StaffRole.STAFF;
    }
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Staff.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Staff.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'photo_url', length: 255 }),
    __metadata("design:type", String)
], Staff.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empl_no', length: 50 }),
    __metadata("design:type", String)
], Staff.prototype, "emplNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_no', length: 50 }),
    __metadata("design:type", String)
], Staff.prototype, "idNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "businessEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'department_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "departmentEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], Staff.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employment_type', length: 100 }),
    __metadata("design:type", String)
], Staff.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Staff.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Staff.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'int' }),
    __metadata("design:type", Number)
], Staff.prototype, "isActiveField", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Staff.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Staff.prototype, "hashPassword", null);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.Entity)('staff')
], Staff);
//# sourceMappingURL=staff.entity.js.map