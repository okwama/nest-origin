import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Staff } from '../users/entities/staff.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateRefreshToken(staff: Staff): string {
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

  generateAccessToken(staff: Staff): string {
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

  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'woosh-refresh-secret'),
        issuer: 'woosh-admin',
        audience: 'woosh-users',
      });
    } catch (error) {
      return null;
    }
  }
} 