import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PayrollService, PayrollCalculationDto, PayrollRecord } from './payroll.service';

@Controller('hr/payroll')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('calculate')
  @RequirePermissions('canManageFinance')
  async calculatePayroll(@Body() calculationDto: PayrollCalculationDto): Promise<PayrollRecord> {
    return this.payrollService.calculatePayroll(calculationDto);
  }

  @Get('staff/:staffId')
  async getStaffPayroll(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('hourlyRate') hourlyRate: string,
    @Request() req,
  ): Promise<PayrollRecord> {
    // Staff can only view their own payroll or managers can view any
    if (req.user.sub !== staffId && !req.user.canManageFinance) {
      throw new Error('Insufficient permissions');
    }
    
    const monthNum = parseInt(month) || new Date().getMonth() + 1;
    const yearNum = parseInt(year) || new Date().getFullYear();
    const hourlyRateNum = hourlyRate ? parseFloat(hourlyRate) : undefined;
    
    return this.payrollService.calculatePayroll({
      staffId,
      month: monthNum,
      year: yearNum,
      hourlyRate: hourlyRateNum,
    });
  }

  @Get('staff/:staffId/history')
  async getStaffPayrollHistory(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Query('year') year: string,
    @Request() req,
  ): Promise<PayrollRecord[]> {
    // Staff can only view their own payroll history or managers can view any
    if (req.user.sub !== staffId && !req.user.canManageFinance) {
      throw new Error('Insufficient permissions');
    }
    
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.payrollService.getPayrollHistory(staffId, yearNum);
  }

  @Get('staff/:staffId/summary')
  async getStaffPayrollSummary(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Query('year') year: string,
    @Request() req,
  ): Promise<any> {
    // Staff can only view their own payroll summary or managers can view any
    if (req.user.sub !== staffId && !req.user.canManageFinance) {
      throw new Error('Insufficient permissions');
    }
    
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.payrollService.getPayrollSummary(staffId, yearNum);
  }

  @Get('department/:department')
  @RequirePermissions('canManageFinance')
  async getDepartmentPayrollSummary(
    @Param('department') department: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<any> {
    const monthNum = parseInt(month) || new Date().getMonth() + 1;
    const yearNum = parseInt(year) || new Date().getFullYear();
    
    return this.payrollService.getDepartmentPayrollSummary(department, monthNum, yearNum);
  }

  // Personal endpoints for staff
  @Get('my-payroll')
  async getMyPayroll(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('hourlyRate') hourlyRate: string,
    @Request() req,
  ): Promise<PayrollRecord> {
    const monthNum = parseInt(month) || new Date().getMonth() + 1;
    const yearNum = parseInt(year) || new Date().getFullYear();
    const hourlyRateNum = hourlyRate ? parseFloat(hourlyRate) : undefined;
    
    return this.payrollService.calculatePayroll({
      staffId: req.user.sub,
      month: monthNum,
      year: yearNum,
      hourlyRate: hourlyRateNum,
    });
  }

  @Get('my-history')
  async getMyPayrollHistory(
    @Query('year') year: string,
    @Request() req,
  ): Promise<PayrollRecord[]> {
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.payrollService.getPayrollHistory(req.user.sub, yearNum);
  }

  @Get('my-summary')
  async getMyPayrollSummary(
    @Query('year') year: string,
    @Request() req,
  ): Promise<any> {
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.payrollService.getPayrollSummary(req.user.sub, yearNum);
  }
} 