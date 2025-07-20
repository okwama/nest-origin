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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let RefreshTokenService = class RefreshTokenService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateRefreshToken(staff) {
        const payload = {
            sub: staff.id,
            phone: staff.phoneNumber,
            type: 'refresh',
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET', 'woosh-refresh-secret'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            issuer: 'woosh-admin',
            audience: 'woosh-users',
        });
    }
    generateAccessToken(staff) {
        const payload = {
            sub: staff.id,
            phone: staff.phoneNumber,
            role: staff.role,
            type: 'access',
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET', 'woosh-secret-key'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
            issuer: 'woosh-admin',
            audience: 'woosh-users',
        });
    }
    verifyRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET', 'woosh-refresh-secret'),
                issuer: 'woosh-admin',
                audience: 'woosh-users',
            });
        }
        catch (error) {
            return null;
        }
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map