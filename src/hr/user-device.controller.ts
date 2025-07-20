import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserDeviceService } from './user-device.service';
import { RegisterDeviceDto, ValidateDeviceDto } from './dto/register-device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hr/devices')
@UseGuards(JwtAuthGuard)
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  /**
   * Silent device registration endpoint
   * Called automatically by the app without user knowledge
   */
  @Post('register')
  async registerDevice(@Request() req, @Body() registerDeviceDto: RegisterDeviceDto) {
    try {
      const userId = req.user.id;
      console.log(`📱 Device registration request: userId=${userId}, deviceId=${registerDeviceDto.deviceId}, deviceType=${registerDeviceDto.deviceType}, deviceName=${registerDeviceDto.deviceName}, deviceModel=${registerDeviceDto.deviceModel}`);
      const result = await this.userDeviceService.registerDevice(userId, registerDeviceDto);
      console.log(`✅ Device registration successful: id=${result.id}`);
      return result;
    } catch (error) {
      console.error(`❌ Device registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate device for check-in
   * Called before every check-in attempt
   */
  @Post('validate')
  async validateDevice(@Body() validateDeviceDto: ValidateDeviceDto) {
    try {
      console.log(`🔍 Device validation request: userId=${validateDeviceDto.userId}, deviceId=${validateDeviceDto.deviceId}`);
      const result = await this.userDeviceService.validateDevice(validateDeviceDto);
      console.log(`✅ Device validation successful`);
      return result;
    } catch (error) {
      console.error(`❌ Device validation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user's devices
   */
  @Get('my-devices')
  async getUserDevices(@Request() req) {
    const userId = req.user.id;
    return await this.userDeviceService.getUserDevices(userId);
  }

  /**
   * Get all pending devices (admin only)
   */
  @Get('pending')
  async getPendingDevices() {
    return await this.userDeviceService.getPendingDevices();
  }

  /**
   * Get pending devices count (admin only)
   */
  @Get('pending/count')
  async getPendingDevicesCount() {
    const count = await this.userDeviceService.getPendingDevicesCount();
    return { pendingCount: count };
  }

  /**
   * Approve or reject a device (admin only)
   */
  @Put(':id/status')
  async updateDeviceStatus(
    @Param('id') deviceId: number,
    @Body() body: { isActive: boolean }
  ) {
    return await this.userDeviceService.updateDeviceStatus(deviceId, body.isActive);
  }

  /**
   * Delete a device (admin only)
   */
  @Delete(':id')
  async deleteDevice(@Param('id') deviceId: number) {
    await this.userDeviceService.deleteDevice(deviceId);
    return { message: 'Device deleted successfully' };
  }

  /**
   * Get device statistics (admin only)
   */
  @Get('stats')
  async getDeviceStats() {
    return await this.userDeviceService.getDeviceStats();
  }

  /**
   * Get device statistics for current user
   */
  @Get('my-stats')
  async getUserDeviceStats(@Request() req) {
    const userId = req.user.id;
    return await this.userDeviceService.getUserDeviceStats(userId);
  }
} 