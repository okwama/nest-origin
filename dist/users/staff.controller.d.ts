import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(createStaffDto: CreateStaffDto, req: any): Promise<import("./entities/staff.entity").Staff>;
    findAll(): Promise<import("./entities/staff.entity").Staff[]>;
    search(query: string): Promise<import("./entities/staff.entity").Staff[]>;
    getStats(): Promise<any>;
    getManagers(): Promise<import("./entities/staff.entity").Staff[]>;
    findByRole(role: string): Promise<import("./entities/staff.entity").Staff[]>;
    findByDepartment(department: string): Promise<import("./entities/staff.entity").Staff[]>;
    findOne(id: string): Promise<import("./entities/staff.entity").Staff>;
    update(id: string, updateStaffDto: UpdateStaffDto, req: any): Promise<import("./entities/staff.entity").Staff>;
    remove(id: string, req: any): Promise<void>;
    activate(id: string, req: any): Promise<import("./entities/staff.entity").Staff>;
    deactivate(id: string, req: any): Promise<import("./entities/staff.entity").Staff>;
    getMyProfile(req: any): Promise<import("./entities/staff.entity").Staff>;
    updateMyProfile(updateStaffDto: UpdateStaffDto, req: any): Promise<import("./entities/staff.entity").Staff>;
    changePassword(changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }, req: any): Promise<{
        message: string;
    }>;
}
