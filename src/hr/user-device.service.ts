import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice, DeviceType } from './entities/user-device.entity';
import { RegisterDeviceDto, ValidateDeviceDto } from './dto/register-device.dto';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,
  ) {}

  /**
   * Silently register a device for a user
   * This happens automatically without user knowledge
   */
  async registerDevice(userId: number, registerDeviceDto: RegisterDeviceDto): Promise<UserDevice> {
    try {
      console.log(`📱 Registering device: userId=${userId}, deviceId=${registerDeviceDto.deviceId}, deviceName=${registerDeviceDto.deviceName}, deviceModel=${registerDeviceDto.deviceModel}`);

      // Check if device already exists for this user
      const existingDevice = await this.userDeviceRepository.findOne({
        where: { userId, deviceId: registerDeviceDto.deviceId }
      });

      if (existingDevice) {
        console.log(`📱 Updating existing device: id=${existingDevice.id}`);
        // Update existing device info
        existingDevice.deviceName = registerDeviceDto.deviceName || existingDevice.deviceName;
        existingDevice.deviceModel = registerDeviceDto.deviceModel || existingDevice.deviceModel;
        existingDevice.osVersion = registerDeviceDto.osVersion || existingDevice.osVersion;
        existingDevice.appVersion = registerDeviceDto.appVersion || existingDevice.appVersion;
        existingDevice.ipAddress = registerDeviceDto.ipAddress || existingDevice.ipAddress;
        
        return await this.userDeviceRepository.save(existingDevice);
      }

      // Auto-approve devices for first-time users (no existing devices)
      const existingDevicesCount = await this.userDeviceRepository.count({
        where: { userId }
      });
      const isAutoApproved = existingDevicesCount === 0; // Auto-approve if this is their first device
      
      if (isAutoApproved) {
        console.log(`🎉 First-time user detected! Auto-approving device for userId=${userId}`);
      } else {
        console.log(`📱 Registered user adding new device: userId=${userId}, existingDevices=${existingDevicesCount}, requiresAdminApproval=true`);
      }

      // Create new device registration
      const newDevice = this.userDeviceRepository.create({
        userId,
        ...registerDeviceDto,
        isActive: isAutoApproved, // Auto-approve for first user
      });

      const savedDevice = await this.userDeviceRepository.save(newDevice);
      console.log(`✅ Device registered successfully: id=${savedDevice.id}, isActive=${savedDevice.isActive}`);
      return savedDevice;
    } catch (error) {
      console.error(`❌ Device registration failed: ${error.message}`);
      throw new Error(`Failed to register device: ${error.message}`);
    }
  }

  /**
   * Validate if a device is approved for check-in
   */
  async validateDevice(validateDeviceDto: ValidateDeviceDto): Promise<boolean> {
    const { userId, deviceId, ipAddress } = validateDeviceDto;

    console.log(`🔍 Validating device: userId=${userId}, deviceId=${deviceId}`);

    // Find the device
    const device = await this.userDeviceRepository.findOne({
      where: { userId, deviceId }
    });

    if (!device) {
      console.log(`❌ Device not found: userId=${userId}, deviceId=${deviceId}`);
      
      // Auto-register device for first-time users
      const existingDevicesCount = await this.userDeviceRepository.count({
        where: { userId }
      });
      
      if (existingDevicesCount === 0) {
        console.log(`🎉 First-time user detected! Auto-registering device for userId=${userId}`);
        try {
          const autoRegisterDto = {
            deviceId,
            deviceName: 'Auto-registered Device',
            deviceType: (deviceId.startsWith('ios_') ? 'ios' : 
                       deviceId.startsWith('android_') ? 'android' : 'web') as DeviceType,
            deviceModel: 'Unknown',
            osVersion: 'Unknown',
            appVersion: '1.0.0',
            ipAddress,
          };
          
          const newDevice = await this.registerDevice(userId, autoRegisterDto);
          console.log(`✅ Auto-registered device: id=${newDevice.id}, isActive=${newDevice.isActive}`);
          
          // Update last used timestamp
          newDevice.lastUsed = new Date();
          await this.userDeviceRepository.save(newDevice);
          
          console.log(`✅ Device validation successful after auto-registration: deviceId=${deviceId}`);
          return true;
        } catch (autoRegError) {
          console.error(`❌ Auto-registration failed: ${autoRegError.message}`);
          throw new ForbiddenException('Device not registered. Please contact HR.');
        }
      } else {
        console.log(`📱 Registered user with existing devices: userId=${userId}, existingDevices=${existingDevicesCount}`);
        throw new ForbiddenException('This device is not registered. Please contact your administrator to register this device.');
      }
      
      throw new ForbiddenException('Device not registered. Please contact HR.');
    }

    console.log(`📱 Device found: id=${device.id}, isActive=${device.isActive}`);

    if (!device.isActive) {
      console.log(`❌ Device not approved: deviceId=${deviceId}, userId=${userId}`);
      throw new ForbiddenException('This device is not approved for check-in. Please contact your administrator to approve this device.');
    }

    // Update last used timestamp
    device.lastUsed = new Date();
    if (ipAddress) {
      device.ipAddress = ipAddress;
    }
    await this.userDeviceRepository.save(device);

    console.log(`✅ Device validation successful: deviceId=${deviceId}`);
    return true;
  }

  /**
   * Get all devices for a user
   */
  async getUserDevices(userId: number): Promise<UserDevice[]> {
    return await this.userDeviceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Get all pending devices (for admin approval)
   */
  async getPendingDevices(): Promise<UserDevice[]> {
    return await this.userDeviceRepository.find({
      where: { isActive: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Get pending devices count (for admin dashboard)
   */
  async getPendingDevicesCount(): Promise<number> {
    return await this.userDeviceRepository.count({
      where: { isActive: false }
    });
  }

  /**
   * Approve or reject a device
   */
  async updateDeviceStatus(deviceId: number, isActive: boolean): Promise<UserDevice> {
    const device = await this.userDeviceRepository.findOne({
      where: { id: deviceId }
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    device.isActive = isActive;
    return await this.userDeviceRepository.save(device);
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceId: number): Promise<void> {
    const device = await this.userDeviceRepository.findOne({
      where: { id: deviceId }
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    await this.userDeviceRepository.remove(device);
  }

  /**
   * Check if a device is approved for a user
   */
  async isDeviceApproved(userId: number, deviceId: string): Promise<boolean> {
    const device = await this.userDeviceRepository.findOne({
      where: { userId, deviceId }
    });

    return device?.isActive ?? false;
  }

  /**
   * Get device statistics
   */
  async getDeviceStats() {
    const totalDevices = await this.userDeviceRepository.count();
    const activeDevices = await this.userDeviceRepository.count({ where: { isActive: true } });
    const pendingDevices = await this.userDeviceRepository.count({ where: { isActive: false } });

    return {
      total: totalDevices,
      active: activeDevices,
      pending: pendingDevices
    };
  }

  /**
   * Get device statistics for a specific user
   */
  async getUserDeviceStats(userId: number) {
    const totalDevices = await this.userDeviceRepository.count({ where: { userId } });
    const activeDevices = await this.userDeviceRepository.count({ where: { userId, isActive: true } });
    const pendingDevices = await this.userDeviceRepository.count({ where: { userId, isActive: false } });

    return {
      userId,
      total: totalDevices,
      active: activeDevices,
      pending: pendingDevices,
      isFirstTimeUser: totalDevices === 0
    };
  }
} 