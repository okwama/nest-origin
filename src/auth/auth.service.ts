import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../users/staff.service';
import { Staff, StaffStatus } from '../users/entities/staff.entity';
import { CreateStaffDto } from '../users/dto/create-staff.dto';
import { RefreshTokenService } from './refresh-token.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
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
    } catch (error) {
      console.error('❌ Error in validateUser:', error);
      throw error;
    }
  }

  async login(staff: Staff) {
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
      expires_in: 900, // 15 minutes in seconds
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

  async register(createStaffDto: CreateStaffDto) {
    // Check if staff already exists
    const existingStaff = await this.staffService.findByPhone(createStaffDto.phoneNumber);
    if (existingStaff) {
      throw new ConflictException('Staff with this phone number already exists');
    }

    if (createStaffDto.businessEmail) {
      const existingEmail = await this.staffService.findByEmail(createStaffDto.businessEmail);
      if (existingEmail) {
        throw new ConflictException('Staff with this email already exists');
      }
    }

    // Create new staff
    const newStaff = await this.staffService.create(createStaffDto);
    
    // Auto-login after registration
    return this.login(newStaff);
  }

  async refreshToken(refreshToken: string) {
    const payload = this.refreshTokenService.verifyRefreshToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const staff = await this.staffService.findOne(payload.sub);
    if (!staff || !staff.isActive()) {
      throw new UnauthorizedException('Staff not found or inactive');
    }

    return this.login(staff);
  }

  async logout(refreshToken: string) {
    // In a production environment, you might want to blacklist the refresh token
    // For now, we'll just return a success response
    return { message: 'Successfully logged out' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { phone, newPassword, confirmPassword } = resetPasswordDto;

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find staff by phone number
    const staff = await this.staffService.findByPhone(phone);
    if (!staff) {
      throw new NotFoundException('Staff not found with this phone number');
    }

    // Check if staff is active
    if (!staff.isActive()) {
      throw new BadRequestException('Account is inactive. Please contact HR to activate your account.');
    }

    // Update password
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
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      throw new BadRequestException('Failed to reset password. Please try again.');
    }
  }
} 