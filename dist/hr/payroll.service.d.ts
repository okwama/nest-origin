import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { StaffService } from '../users/staff.service';
export interface PayrollCalculationDto {
    staffId: number;
    month: number;
    year: number;
    hourlyRate?: number;
}
export interface PayrollRecord {
    staffId: number;
    month: number;
    year: number;
    totalHours: number;
    overtimeHours: number;
    regularHours: number;
    hourlyRate: number;
    regularPay: number;
    overtimePay: number;
    totalPay: number;
    lateDeductions: number;
    earlyDepartureDeductions: number;
    netPay: number;
}
export declare class PayrollService {
    private attendanceRepository;
    private staffService;
    constructor(attendanceRepository: Repository<Attendance>, staffService: StaffService);
    calculatePayroll(calculationDto: PayrollCalculationDto): Promise<PayrollRecord>;
    getPayrollHistory(staffId: number, year?: number): Promise<PayrollRecord[]>;
    getPayrollSummary(staffId: number, year?: number): Promise<any>;
    getDepartmentPayrollSummary(department: string, month: number, year: number): Promise<any>;
}
