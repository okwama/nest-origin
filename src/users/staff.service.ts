import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Staff, StaffRole, StaffStatus } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto, createdBy?: number): Promise<Staff> {
    // Check if business email already exists
    if (createStaffDto.businessEmail) {
      const existingEmail = await this.staffRepository.findOne({
        where: { businessEmail: createStaffDto.businessEmail }
      });
      if (existingEmail) {
        throw new ConflictException('Business email already exists');
      }
    }

    // Check if phone number already exists
    const existingPhone = await this.staffRepository.findOne({
      where: { phoneNumber: createStaffDto.phoneNumber }
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    // Create staff entity instance
    const staff = this.staffRepository.create({
      ...createStaffDto,
      photoUrl: createStaffDto.photoUrl || '',
      isActiveField: 1, // Set as active by default
    });

    // Save the entity (this will trigger BeforeInsert hook for password hashing)
    return this.staffRepository.save(staff);
  }

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id }
    });
    
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    
    return staff;
  }

  async findStaffById(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { businessEmail: email }
    });
  }

  async findByPhone(phone: string): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({
      where: { phoneNumber: phone }
    });
    
    if (staff) {
      // Ensure we return a proper Staff entity instance
      return this.staffRepository.create(staff);
    }
    
    return null;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto, updatedBy?: number): Promise<Staff> {
    console.log('Update request received:', { id, updateStaffDto });
    const staff = await this.findOne(id);

    // Check for business email conflicts if email is being updated
    if (updateStaffDto.businessEmail && updateStaffDto.businessEmail !== staff.businessEmail) {
      const existingEmail = await this.staffRepository.findOne({
        where: { businessEmail: updateStaffDto.businessEmail }
      });
      if (existingEmail) {
        throw new ConflictException('Business email already exists');
      }
    }

    // Check for phone number conflicts if phone is being updated
    if (updateStaffDto.phoneNumber && updateStaffDto.phoneNumber !== staff.phoneNumber) {
      const existingPhone = await this.staffRepository.findOne({
        where: { phoneNumber: updateStaffDto.phoneNumber }
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Filter out undefined and empty strings, but allow null for clearing fields
    const updateData = Object.fromEntries(
      Object.entries(updateStaffDto).filter(([_, value]) => {
        if (value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
      })
    );

    console.log('Filtered update data:', updateData);

    // Check if we have any data to update
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid data provided for update');
    }

    // Additional validation: ensure all values are of expected types
    for (const [key, value] of Object.entries(updateData)) {
      if (typeof value === 'string' && value.trim() === '') {
        delete updateData[key];
      }
      // Allow null values for clearing fields
    }

    // Final check after additional filtering
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid data provided for update');
    }

    await this.staffRepository.update(id, updateData);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.update(id, { isActiveField: 0 });
  }

  async search(query: string): Promise<Staff[]> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');
    
    // Add search query
    if (query) {
      queryBuilder.andWhere(
        '(staff.name LIKE :query OR staff.business_email LIKE :query OR staff.phone_number LIKE :query OR staff.department LIKE :query)',
        { query: `%${query}%` }
      );
    }
    
    return queryBuilder
      .orderBy('staff.name', 'ASC')
      .getMany();
  }

  async findByRole(role: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { role, isActiveField: 1 },
      order: { name: 'ASC' },
    });
  }

  async findByDepartment(department: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { department, isActiveField: 1 },
      order: { name: 'ASC' },
    });
  }

  async getStaffStats(): Promise<any> {
    const total = await this.staffRepository.count();
    const active = await this.staffRepository.count({ where: { isActiveField: 1 } });
    const inactive = await this.staffRepository.count({ where: { isActiveField: 0 } });

    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? (active / total) * 100 : 0,
    };
  }

  async getManagers(): Promise<Staff[]> {
    return this.staffRepository.find({
      where: {
        role: 'manager',
        isActiveField: 1
      },
      order: { name: 'ASC' },
    });
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const staff = await this.findOne(id);
    
    // Create a new staff instance with the new password
    const updatedStaff = this.staffRepository.create({
      ...staff,
      password: newPassword, // This will trigger the BeforeUpdate hook for hashing
    });

    // Save the updated staff (password will be hashed automatically)
    await this.staffRepository.save(updatedStaff);
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const staff = await this.findOne(id);
    
    // Validate current password
    const isValidPassword = await staff.validatePassword(currentPassword);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update to new password
    await this.updatePassword(id, newPassword);
    
    return { message: 'Password changed successfully' };
  }
} 