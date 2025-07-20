import { IsString, IsOptional, IsIP } from 'class-validator';

export class CreateAllowedIpDto {
  @IsIP()
  ipAddress: string;

  @IsOptional()
  @IsString()
  description?: string;
} 