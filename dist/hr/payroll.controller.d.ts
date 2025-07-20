import { PayrollService, PayrollCalculationDto, PayrollRecord } from './payroll.service';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    calculatePayroll(calculationDto: PayrollCalculationDto): Promise<PayrollRecord>;
    getStaffPayroll(staffId: number, month: string, year: string, hourlyRate: string, req: any): Promise<PayrollRecord>;
    getStaffPayrollHistory(staffId: number, year: string, req: any): Promise<PayrollRecord[]>;
    getStaffPayrollSummary(staffId: number, year: string, req: any): Promise<any>;
    getDepartmentPayrollSummary(department: string, month: string, year: string): Promise<any>;
    getMyPayroll(month: string, year: string, hourlyRate: string, req: any): Promise<PayrollRecord>;
    getMyPayrollHistory(year: string, req: any): Promise<PayrollRecord[]>;
    getMyPayrollSummary(year: string, req: any): Promise<any>;
}
