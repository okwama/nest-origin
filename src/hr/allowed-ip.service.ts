import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllowedIp } from './entities/allowed-ip.entity';

@Injectable()
export class AllowedIpService {
  constructor(
    @InjectRepository(AllowedIp)
    private allowedIpRepository: Repository<AllowedIp>,
  ) {}

  // Simple IP validation function that doesn't rely on external packages
  private isIpInCidrRange(ip: string, cidr: string): boolean {
    try {
      const [network, bits] = cidr.split('/');
      const mask = parseInt(bits);
      
      if (isNaN(mask) || mask < 0 || mask > 32) {
        return false;
      }
      
      // Convert IPs to numbers
      const ipNum = this.ipToNumber(ip);
      const networkNum = this.ipToNumber(network);
      
      if (ipNum === null || networkNum === null) {
        return false;
      }
      
      // Calculate network mask
      const maskNum = mask === 32 ? 0xFFFFFFFF : (0xFFFFFFFF << (32 - mask));
      
      // Check if IP is in the same network
      return (ipNum & maskNum) === (networkNum & maskNum);
    } catch (error) {
      console.log(`Error validating CIDR ${cidr}:`, error);
      return false;
    }
  }

  private ipToNumber(ip: string): number | null {
    try {
      const parts = ip.split('.');
      if (parts.length !== 4) return null;
      
      let result = 0;
      for (let i = 0; i < 4; i++) {
        const part = parseInt(parts[i]);
        if (isNaN(part) || part < 0 || part > 255) return null;
        result = (result << 8) + part;
      }
      return result;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<AllowedIp[]> {
    return this.allowedIpRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<AllowedIp> {
    return this.allowedIpRepository.findOne({ where: { id } });
  }

  async findByIpAddress(ipAddress: string): Promise<AllowedIp> {
    // Trim whitespace from the input IP address
    const trimmedIp = ipAddress.trim();
    console.log(`Looking for IP: "${trimmedIp}" (original: "${ipAddress}")`);
    
    const result = await this.allowedIpRepository.findOne({ 
      where: { ipAddress: trimmedIp, isActive: true } 
    });
    
    console.log(`Found allowed IP:`, result);
    return result;
  }

  async isIpAllowed(ipAddress: string): Promise<boolean> {
    // Trim whitespace from the input IP address
    const trimmedIp = ipAddress.trim();
    console.log(`Checking if IP is allowed: "${trimmedIp}"`);
    
    // Get all allowed IPs (including CIDR ranges)
    const allowedIps = await this.allowedIpRepository.find({
      where: { isActive: true }
    });
    
    // Check for exact match first
    const exactMatch = allowedIps.find(ip => ip.ipAddress === trimmedIp);
    if (exactMatch) {
      console.log(`IP "${trimmedIp}" is allowed (exact match)`);
      return true;
    }
    
    // Check CIDR ranges using our custom function
    for (const allowedIp of allowedIps) {
      if (allowedIp.ipAddress.includes('/')) {
        try {
          if (this.isIpInCidrRange(trimmedIp, allowedIp.ipAddress)) {
            console.log(`IP "${trimmedIp}" is allowed (within range: ${allowedIp.ipAddress})`);
            return true;
          }
        } catch (error) {
          console.log(`Error checking CIDR range ${allowedIp.ipAddress}:`, error);
        }
      }
    }
    
    console.log(`IP "${trimmedIp}" is not allowed`);
    return false;
  }

  async create(ipAddress: string, description?: string): Promise<AllowedIp> {
    // Trim whitespace from the IP address before saving
    const trimmedIp = ipAddress.trim();
    const allowedIp = this.allowedIpRepository.create({
      ipAddress: trimmedIp,
      description,
      isActive: true,
    });
    return this.allowedIpRepository.save(allowedIp);
  }

  async update(id: number, data: Partial<AllowedIp>): Promise<AllowedIp> {
    await this.allowedIpRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.allowedIpRepository.delete(id);
  }

  async deactivate(id: number): Promise<AllowedIp> {
    return this.update(id, { isActive: false });
  }

  async activate(id: number): Promise<AllowedIp> {
    return this.update(id, { isActive: true });
  }
} 