import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(checkInDto: CheckInDto, req: any): Promise<any>;
    checkOut(checkOutDto: CheckOutDto, req: any): Promise<any>;
    getCurrentAttendance(staffId: number, req: any): Promise<Attendance | null>;
    getAttendanceByStaff(staffId: number, req: any, startDate?: string, endDate?: string): Promise<Attendance[]>;
    getAttendanceByDate(date: string): Promise<Attendance[]>;
    getAttendanceStats(req: any, staffId?: string, startDate?: string, endDate?: string): Promise<any>;
    updateAttendance(id: number, updateData: Partial<Attendance>): Promise<Attendance>;
    deleteAttendance(id: number): Promise<void>;
    getMyAttendance(req: any, startDate?: string, endDate?: string): Promise<Attendance[]>;
    getMyCurrentAttendance(req: any): Promise<Attendance | null>;
    getMyAttendanceStats(req: any, startDate?: string, endDate?: string): Promise<any>;
}
