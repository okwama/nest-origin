import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckOutDto {
  @IsString()
  deviceId: string;

  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 