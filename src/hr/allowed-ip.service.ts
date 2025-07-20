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
    
    // Check CIDR ranges
    for (const allowedIp of allowedIps) {
      if (allowedIp.ipAddress.includes('/')) {
        try {
          // Dynamic import for ES module compatibility
          const { default: IPCIDR } = await import('ip-cidr');
          const cidr = new IPCIDR(allowedIp.ipAddress);
          if (cidr.contains(trimmedIp)) {
            console.log(`IP "${trimmedIp}" is allowed (within range: ${allowedIp.ipAddress})`);
            return true;
          }
        } catch (error) {
          console.log(`Invalid CIDR format: ${allowedIp.ipAddress}`);
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