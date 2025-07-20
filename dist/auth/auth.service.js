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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const staff_service_1 = require("../users/staff.service");
const refresh_token_service_1 = require("./refresh-token.service");
let AuthService = class AuthService {
    constructor(staffService, jwtService, refreshTokenService) {
        this.staffService = staffService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }
    async validateUser(phoneNumber, password) {
        try {
            const staff = await this.staffService.findByPhone(phoneNumber);
            if (!staff) {
                return null;
            }
            if (!staff.isActive()) {
                return null;
            }
            const isValidPassword = await staff.validatePassword(password);
            if (isValidPassword) {
                const { password, ...result } = staff;
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error in validateUser:', error);
            throw error;
        }
    }
    async login(staff) {
        const payload = {
            sub: staff.id,
            phone: staff.phoneNumber,
            role: staff.role,
        };
        const accessToken = this.refreshTokenService.generateAccessToken(staff);
        const refreshToken = this.refreshTokenService.generateRefreshToken(staff);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 900,
            token_type: 'Bearer',
            user: {
                id: staff.id,
                name: staff.name,
                phoneNumber: staff.phoneNumber,
                businessEmail: staff.businessEmail,
                departmentEmail: staff.departmentEmail,
                role: staff.role,
                department: staff.department,
                employmentType: staff.employmentType,
                salary: staff.salary,
                isActive: typeof staff.isActive === 'function' ? staff.isActive() : staff.isActiveField === 1,
            },
        };
    }
    async register(createStaffDto) {
        const existingStaff = await this.staffService.findByPhone(createStaffDto.phoneNumber);
        if (existingStaff) {
            throw new common_1.ConflictException('Staff with this phone number already exists');
        }
        if (createStaffDto.businessEmail) {
            const existingEmail = await this.staffService.findByEmail(createStaffDto.businessEmail);
            if (existingEmail) {
                throw new common_1.ConflictException('Staff with this email already exists');
            }
        }
        const newStaff = await this.staffService.create(createStaffDto);
        return this.login(newStaff);
    }
    async refreshToken(refreshToken) {
        const payload = this.refreshTokenService.verifyRefreshToken(refreshToken);
        if (!payload || payload.type !== 'refresh') {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const staff = await this.staffService.findOne(payload.sub);
        if (!staff || !staff.isActive()) {
            throw new common_1.UnauthorizedException('Staff not found or inactive');
        }
        return this.login(staff);
    }
    async logout(refreshToken) {
        return { message: 'Successfully logged out' };
    }
    async resetPassword(resetPasswordDto) {
        const { phone, newPassword, confirmPassword } = resetPasswordDto;
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const staff = await this.staffService.findByPhone(phone);
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found with this phone number');
        }
        if (!staff.isActive()) {
            throw new common_1.BadRequestException('Account is inactive. Please contact HR to activate your account.');
        }
        try {
            await this.staffService.updatePassword(staff.id, newPassword);
            return {
                message: 'Password reset successfully',
                user: {
                    id: staff.id,
                    name: staff.name,
                    phoneNumber: staff.phoneNumber,
                    role: staff.role,
                }
            };
        }
        catch (error) {
            console.error('❌ Error resetting password:', error);
            throw new common_1.BadRequestException('Failed to reset password. Please try again.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_service_1.StaffService,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map