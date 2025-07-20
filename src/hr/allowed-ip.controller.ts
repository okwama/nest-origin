import { Controller, Post, Get, Body, HttpException, HttpStatus, UseGuards, Param } from '@nestjs/common';
import { AllowedIpService } from './allowed-ip.service';
import { CreateAllowedIpDto } from './dto/create-allowed-ip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('hr/allowed-ips')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AllowedIpController {
  constructor(private readonly allowedIpService: AllowedIpService) {}

  @Get()
  @Permissions('canManageUsers')
  async findAll() {
    return await this.allowedIpService.findAll();
  }

  @Get('check/:ipAddress')
  async checkIp(@Param('ipAddress') ipAddress: string) {
    const isAllowed = await this.allowedIpService.isIpAllowed(ipAddress);
    return {
      ipAddress,
      isAllowed,
      message: isAllowed ? 'IP is allowed' : 'IP is not allowed'
    };
  }

  @Post()
  @Permissions('canManageUsers')
  async create(@Body() createAllowedIpDto: CreateAllowedIpDto) {
    try {
      return await this.allowedIpService.create(
        createAllowedIpDto.ipAddress,
        createAllowedIpDto.description,
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'IP address already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }
} 