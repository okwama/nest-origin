import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Staff } from '../users/entities/staff.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Staff]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'woosh-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'), // Shorter access token
          issuer: 'woosh-admin',
          audience: 'woosh-users',
        },
        verifyOptions: {
          issuer: 'woosh-admin',
          audience: 'woosh-users',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, JwtStrategy, LocalStrategy],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {} 