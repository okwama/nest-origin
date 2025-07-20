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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const create_staff_dto_1 = require("./dto/create-staff.dto");
const update_staff_dto_1 = require("./dto/update-staff.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async create(createStaffDto, req) {
        return this.staffService.create(createStaffDto);
    }
    async findAll() {
        return this.staffService.findAll();
    }
    async search(query) {
        return this.staffService.search(query);
    }
    async getStats() {
        return this.staffService.getStaffStats();
    }
    async getManagers() {
        return this.staffService.getManagers();
    }
    async findByRole(role) {
        return this.staffService.findByRole(role);
    }
    async findByDepartment(department) {
        return this.staffService.findByDepartment(department);
    }
    async findOne(id) {
        return this.staffService.findOne(Number(id));
    }
    async update(id, updateStaffDto, req) {
        const targetId = Number(id);
        return this.staffService.update(targetId, updateStaffDto);
    }
    async remove(id, req) {
        await this.staffService.remove(Number(id));
    }
    async activate(id, req) {
        return this.staffService.update(Number(id), { isActiveField: 1 });
    }
    async deactivate(id, req) {
        return this.staffService.update(Number(id), { isActiveField: 0 });
    }
    async getMyProfile(req) {
        console.log('Profile request - req.user:', req.user);
        const userId = Number(req.user.id);
        console.log('Profile request - userId:', userId);
        if (isNaN(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        return this.staffService.findOne(userId);
    }
    async updateMyProfile(updateStaffDto, req) {
        const userId = Number(req.user.id);
        if (isNaN(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        return this.staffService.update(userId, updateStaffDto);
    }
    async changePassword(changePasswordDto, req) {
        const userId = Number(req.user.id);
        if (isNaN(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        return this.staffService.changePassword(userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('managers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)('department/:department'),
    __param(0, (0, common_1.Param)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('profile/me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_staff_dto_1.UpdateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('profile/me/change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "changePassword", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map