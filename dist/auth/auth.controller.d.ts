import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateStaffDto } from '../users/dto/create-staff.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
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
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
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
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
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
