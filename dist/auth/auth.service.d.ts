import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../users/staff.service';
import { Staff } from '../users/entities/staff.entity';
import { CreateStaffDto } from '../users/dto/create-staff.dto';
import { RefreshTokenService } from './refresh-token.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private staffService;
    private jwtService;
    private refreshTokenService;
    constructor(staffService: StaffService, jwtService: JwtService, refreshTokenService: RefreshTokenService);
    validateUser(phoneNumber: string, password: string): Promise<any>;
    login(staff: Staff): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: {
            id: number;
            name: string;
            phoneNumber: string;
            businessEmail: string;
            departmentEmail: string;
            role: string;
            department: string;
            employmentType: string;
            salary: number;
            isActive: boolean;
        };
    }>;
    register(createStaffDto: CreateStaffDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: {
            id: number;
            name: string;
            phoneNumber: string;
            businessEmail: string;
            departmentEmail: string;
            role: string;
            department: string;
            employmentType: string;
            salary: number;
            isActive: boolean;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: {
            id: number;
            name: string;
            phoneNumber: string;
            businessEmail: string;
            departmentEmail: string;
            role: string;
            department: string;
            employmentType: string;
            salary: number;
            isActive: boolean;
        };
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            phoneNumber: string;
            role: string;
        };
    }>;
}
