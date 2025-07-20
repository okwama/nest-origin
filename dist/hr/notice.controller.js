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
exports.NoticeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../auth/guards/permission.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const notice_service_1 = require("./notice.service");
const create_notice_dto_1 = require("./dto/create-notice.dto");
const update_notice_dto_1 = require("./dto/update-notice.dto");
let NoticeController = class NoticeController {
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    async createNotice(createDto) {
        return this.noticeService.create(createDto);
    }
    async updateNotice(id, updateDto) {
        return this.noticeService.update(id, updateDto);
    }
    async getNoticeById(id) {
        return this.noticeService.findOne(id);
    }
    async getAllNotices(req, countryId, limit) {
        const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
        const limitNum = limit ? parseInt(limit) : undefined;
        return this.noticeService.findAll();
    }
    async getRecentNotices(req, countryId, limit) {
        const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.noticeService.findAll();
    }
    async deleteNotice(id) {
        return this.noticeService.delete(id);
    }
    async searchNotices(req, query, countryId) {
        const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
        return this.noticeService.findAll();
    }
    async getNoticeStats(req, countryId) {
        const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
        return { total: 0, recent: 0 };
    }
    async getPublicNotices(countryId, limit) {
        const countryIdNum = countryId ? parseInt(countryId) : undefined;
        const limitNum = limit ? parseInt(limit) : undefined;
        return this.noticeService.findAll();
    }
    async getPublicRecentNotices(countryId, limit) {
        const countryIdNum = countryId ? parseInt(countryId) : undefined;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.noticeService.findAll();
    }
};
exports.NoticeController = NoticeController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_dto_1.CreateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "createNotice", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notice_dto_1.UpdateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "updateNotice", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getNoticeById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('countryId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getAllNotices", null);
__decorate([
    (0, common_1.Get)('recent/list'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('countryId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getRecentNotices", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "deleteNotice", null);
__decorate([
    (0, common_1.Get)('search/query'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "searchNotices", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getNoticeStats", null);
__decorate([
    (0, common_1.Get)('public/all'),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Query)('countryId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getPublicNotices", null);
__decorate([
    (0, common_1.Get)('public/recent'),
    (0, permissions_decorator_1.Permissions)('canManageUsers'),
    __param(0, (0, common_1.Query)('countryId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "getPublicRecentNotices", null);
exports.NoticeController = NoticeController = __decorate([
    (0, common_1.Controller)('hr/notices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [notice_service_1.NoticeService])
], NoticeController);
//# sourceMappingURL=notice.controller.js.map