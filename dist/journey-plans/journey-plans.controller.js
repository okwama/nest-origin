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
exports.JourneyPlansController = void 0;
const common_1 = require("@nestjs/common");
const journey_plans_service_1 = require("./journey-plans.service");
const create_journey_plan_dto_1 = require("./dto/create-journey-plan.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let JourneyPlansController = class JourneyPlansController {
    constructor(journeyPlansService) {
        this.journeyPlansService = journeyPlansService;
    }
    create(createJourneyPlanDto) {
        return this.journeyPlansService.create(createJourneyPlanDto);
    }
    findAll() {
        return this.journeyPlansService.findAll();
    }
    findOne(id) {
        return this.journeyPlansService.findOne(+id);
    }
    update(id, updateJourneyPlanDto) {
        return this.journeyPlansService.update(+id, updateJourneyPlanDto);
    }
    remove(id) {
        return this.journeyPlansService.remove(+id);
    }
};
exports.JourneyPlansController = JourneyPlansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_journey_plan_dto_1.CreateJourneyPlanDto]),
    __metadata("design:returntype", void 0)
], JourneyPlansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JourneyPlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JourneyPlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JourneyPlansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JourneyPlansController.prototype, "remove", null);
exports.JourneyPlansController = JourneyPlansController = __decorate([
    (0, common_1.Controller)('journey-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [journey_plans_service_1.JourneyPlansService])
], JourneyPlansController);
//# sourceMappingURL=journey-plans.controller.js.map