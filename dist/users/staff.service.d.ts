import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffService {
    private staffRepository;
    constructor(staffRepository: Repository<Staff>);
    create(createStaffDto: CreateStaffDto, createdBy?: number): Promise<Staff>;
    findAll(): Promise<Staff[]>;
    findOne(id: number): Promise<Staff>;
    findStaffById(id: number): Promise<Staff | null>;
    findByEmail(email: string): Promise<Staff | null>;
    findByPhone(phone: string): Promise<Staff | null>;
    update(id: number, updateStaffDto: UpdateStaffDto, updatedBy?: number): Promise<Staff>;
    remove(id: number): Promise<void>;
    search(query: string): Promise<Staff[]>;
    findByRole(role: string): Promise<Staff[]>;
    findByDepartment(department: string): Promise<Staff[]>;
    getStaffStats(): Promise<any>;
    getManagers(): Promise<Staff[]>;
    updatePassword(id: number, newPassword: string): Promise<void>;
    changePassword(id: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
