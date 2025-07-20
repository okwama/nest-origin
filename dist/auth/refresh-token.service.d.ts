import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Staff } from '../users/entities/staff.entity';
export declare class RefreshTokenService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateRefreshToken(staff: Staff): string;
    generateAccessToken(staff: Staff): string;
    verifyRefreshToken(token: string): any;
}
