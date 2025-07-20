import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { StaffService } from '../users/staff.service';
import { AllowedIpService } from './allowed-ip.service';
import { UserDeviceService } from './user-device.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private staffService;
    private allowedIpService;
    private userDeviceService;
    private dbConnection;
    constructor(attendanceRepository: Repository<Attendance>, staffService: StaffService, allowedIpService: AllowedIpService, userDeviceService: UserDeviceService);
    private getDbConnection;
    checkIn(checkInDto: CheckInDto): Promise<Attendance>;
    checkOut(checkOutDto: CheckOutDto & {
        staffId: number;
    }): Promise<Attendance>;
    getAttendanceByStaff(staffId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]>;
    getAttendanceByDate(date: Date): Promise<Attendance[]>;
    getAttendanceStats(staffId?: number, startDate?: Date, endDate?: Date): Promise<any>;
    getCurrentAttendance(staffId: number): Promise<Attendance | null>;
    updateAttendance(id: number, updateData: Partial<Attendance>): Promise<Attendance>;
    deleteAttendance(id: number): Promise<void>;
    validateDeviceAndIp(staffId: number, deviceId: string, ipAddress: string): Promise<boolean>;
}
