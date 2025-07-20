import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { DeviceType } from '../entities/user-device.entity';

export class RegisterDeviceDto {
  @IsString()
  deviceId: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @IsOptional()
  @IsString()
  deviceModel?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class ValidateDeviceDto {
  @IsNumber()
  userId: number;

  @IsString()
  deviceId: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
} 