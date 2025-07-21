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
exports.OutOfOfficeController = void 0;
const common_1 = require("@nestjs/common");
const out_of_office_service_1 = require("./out-of-office.service");
const create_out_of_office_dto_1 = require("./dto/create-out-of-office.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OutOfOfficeController = class OutOfOfficeController {
    constructor(service) {
        this.service = service;
    }
    async apply(dto, req) {
        console.log('DEBUG OutOfOfficeController.apply received dto:', dto);
        return this.service.create({ ...dto, staff_id: req.user.id });
    }
    async myRequests(req) {
        return this.service.findByStaff(req.user.id);
    }
};
exports.OutOfOfficeController = OutOfOfficeController;
__decorate([
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_out_of_office_dto_1.CreateOutOfOfficeDto, Object]),
    __metadata("design:returntype", Promise)
], OutOfOfficeController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutOfOfficeController.prototype, "myRequests", null);
exports.OutOfOfficeController = OutOfOfficeController = __decorate([
    (0, common_1.Controller)('out-of-office'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [out_of_office_service_1.OutOfOfficeService])
], OutOfOfficeController);
//# sourceMappingURL=out-of-office.controller.js.map