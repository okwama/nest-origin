import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
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

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private staffService: StaffService,
  ) {}

  async calculatePayroll(calculationDto: PayrollCalculationDto): Promise<PayrollRecord> {
    const { staffId, month, year, hourlyRate = 10 } = calculationDto;

    // Verify staff exists
    const staff = await this.staffService.findOne(staffId);
    if (!staff) {
      throw new Error('Staff not found');
    }

    // Get attendance records for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    const attendanceRecords = await this.attendanceRepository.find({
      where: {
        staffId,
        date: Between(startDate, endDate),
        checkOutTime: Not(null), // Only completed days
      },
    });

    let totalHours = 0;
    let overtimeHours = 0;
    let regularHours = 0;
    let lateDeductions = 0;
    let earlyDepartureDeductions = 0;

    // Calculate totals from attendance records
    attendanceRecords.forEach(record => {
      if (record.totalHours) {
        totalHours += record.totalHours;
        
        // Regular hours (8 hours per day)
        const dailyRegularHours = Math.min(record.totalHours, 8);
        regularHours += dailyRegularHours;
        
        // Overtime hours (hours beyond 8 per day)
        const dailyOvertimeHours = Math.max(0, record.totalHours - 8);
        overtimeHours += dailyOvertimeHours;
      }

      // Calculate deductions for late arrivals and early departures
      if (record.lateMinutes > 0) {
        lateDeductions += (record.lateMinutes / 60) * hourlyRate * 0.5; // 50% deduction for late
      }

      if (record.earlyDepartureMinutes > 0) {
        earlyDepartureDeductions += (record.earlyDepartureMinutes / 60) * hourlyRate * 0.5; // 50% deduction for early departure
      }
    });

    // Calculate pay
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x rate for overtime
    const totalPay = regularPay + overtimePay;
    const netPay = totalPay - lateDeductions - earlyDepartureDeductions;

    return {
      staffId,
      month,
      year,
      totalHours,
      overtimeHours,
      regularHours,
      hourlyRate,
      regularPay,
      overtimePay,
      totalPay,
      lateDeductions,
      earlyDepartureDeductions,
      netPay,
    };
  }

  async getPayrollHistory(staffId: number, year?: number): Promise<PayrollRecord[]> {
    const currentYear = year || new Date().getFullYear();
    const payrollRecords: PayrollRecord[] = [];

    // Calculate payroll for each month
    for (let month = 1; month <= 12; month++) {
      try {
        const payroll = await this.calculatePayroll({
          staffId,
          month,
          year: currentYear,
        });
        payrollRecords.push(payroll);
      } catch (error) {
        // Skip months with no attendance data
        continue;
      }
    }

    return payrollRecords;
  }

  async getPayrollSummary(staffId: number, year?: number): Promise<any> {
    const payrollHistory = await this.getPayrollHistory(staffId, year);
    
    const summary = payrollHistory.reduce((acc, record) => {
      acc.totalHours += record.totalHours;
      acc.overtimeHours += record.overtimeHours;
      acc.regularPay += record.regularPay;
      acc.overtimePay += record.overtimePay;
      acc.totalPay += record.totalPay;
      acc.lateDeductions += record.lateDeductions;
      acc.earlyDepartureDeductions += record.earlyDepartureDeductions;
      acc.netPay += record.netPay;
      acc.monthsWorked++;
      return acc;
    }, {
      totalHours: 0,
      overtimeHours: 0,
      regularPay: 0,
      overtimePay: 0,
      totalPay: 0,
      lateDeductions: 0,
      earlyDepartureDeductions: 0,
      netPay: 0,
      monthsWorked: 0,
      averageMonthlyPay: 0,
    });

    summary.averageMonthlyPay = summary.monthsWorked > 0 ? summary.netPay / summary.monthsWorked : 0;

    return summary;
  }

  async getDepartmentPayrollSummary(department: string, month: number, year: number): Promise<any> {
    // Get all staff in the department
    const staffList = await this.staffService.findByDepartment(department);
    
    const departmentPayroll = await Promise.all(
      staffList.map(async (staff) => {
        try {
          return await this.calculatePayroll({
            staffId: staff.id,
            month,
            year,
          });
        } catch (error) {
          return null;
        }
      })
    );

    const validPayrolls = departmentPayroll.filter(payroll => payroll !== null);

    const summary = validPayrolls.reduce((acc, payroll) => {
      acc.totalStaff++;
      acc.totalHours += payroll.totalHours;
      acc.totalPay += payroll.totalPay;
      acc.totalNetPay += payroll.netPay;
      return acc;
    }, {
      totalStaff: 0,
      totalHours: 0,
      totalPay: 0,
      totalNetPay: 0,
      averagePayPerStaff: 0,
    });

    summary.averagePayPerStaff = summary.totalStaff > 0 ? summary.totalNetPay / summary.totalStaff : 0;

    return summary;
  }
} 