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
exports.BranchGateway = exports.ValidationMethod = void 0;
const typeorm_1 = require("typeorm");
var ValidationMethod;
(function (ValidationMethod) {
    ValidationMethod["IP_ONLY"] = "ip_only";
    ValidationMethod["MAC_ONLY"] = "mac_only";
    ValidationMethod["IP_AND_MAC"] = "ip_and_mac";
    ValidationMethod["IP_AND_SSID"] = "ip_and_ssid";
    ValidationMethod["IP_MAC_SSID"] = "ip_mac_ssid";
})(ValidationMethod || (exports.ValidationMethod = ValidationMethod = {}));
let BranchGateway = class BranchGateway {
};
exports.BranchGateway = BranchGateway;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BranchGateway.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_name', length: 100 }),
    __metadata("design:type", String)
], BranchGateway.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_code', length: 20 }),
    __metadata("design:type", String)
], BranchGateway.prototype, "branchCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_ip', length: 50 }),
    __metadata("design:type", String)
], BranchGateway.prototype, "gatewayIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_mac', length: 50, nullable: true }),
    __metadata("design:type", String)
], BranchGateway.prototype, "gatewayMac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ssid', length: 100, nullable: true }),
    __metadata("design:type", String)
], BranchGateway.prototype, "ssid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], BranchGateway.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], BranchGateway.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'radius_meters', type: 'int', default: 50 }),
    __metadata("design:type", Number)
], BranchGateway.prototype, "radiusMeters", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'validation_method',
        type: 'enum',
        enum: ValidationMethod,
        default: ValidationMethod.IP_AND_SSID,
    }),
    __metadata("design:type", String)
], BranchGateway.prototype, "validationMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BranchGateway.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BranchGateway.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BranchGateway.prototype, "updatedAt", void 0);
exports.BranchGateway = BranchGateway = __decorate([
    (0, typeorm_1.Entity)('branch_gateways'),
    (0, typeorm_1.Index)(['branchCode'], { unique: true }),
    (0, typeorm_1.Index)(['gatewayIp']),
    (0, typeorm_1.Index)(['gatewayMac']),
    (0, typeorm_1.Index)(['ssid']),
    (0, typeorm_1.Index)(['isActive'])
], BranchGateway);
//# sourceMappingURL=branch-gateway.entity.js.map