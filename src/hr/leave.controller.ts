import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { LeaveType } from './entities/leave-type.entity';

@Controller('hr/leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard) // Only require authentication, no special permissions
  async createLeaveRequest(@Body() createDto: CreateLeaveRequestDto, @Request() req): Promise<LeaveRequest> {
    // Automatically set the employeeId from the authenticated user
    const requestWithEmployeeId = {
      ...createDto,
      employeeId: req.user.id,
    };
    
    return this.leaveService.createLeaveRequest(requestWithEmployeeId);
  }

  @Put('request/:id/approve')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async approveLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string },
    @Request() req,
  ): Promise<LeaveRequest> {
    return this.leaveService.approveLeaveRequest(id, req.user.id, body.notes);
  }

  @Put('request/:id/reject')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async rejectLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string },
    @Request() req,
  ): Promise<LeaveRequest> {
    return this.leaveService.rejectLeaveRequest(id, req.user.id, body.notes);
  }

  @Put('request/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<any> {
    // Check if user owns the request or has management permissions
    const leaveRequest = await this.leaveService.getLeaveRequestById(id);
    if (req.user.id !== leaveRequest.employeeId && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to cancel this request');
    }
    
    return this.leaveService.cancelLeaveRequest(id);
  }

  @Get('requests')
  async getLeaveRequests(
    @Request() req,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<LeaveRequest[]> {
    // Staff can only view their own requests or managers can view any
    if (employeeId && req.user.id !== parseInt(employeeId) && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const employeeIdNum = employeeId ? parseInt(employeeId) : undefined;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.leaveService.getLeaveRequests(employeeIdNum, status, start, end);
  }

  @Get('request/:id')
  async getLeaveRequestById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveService.getLeaveRequestById(id);
    
    // Staff can only view their own requests or managers can view any
    if (req.user.id !== leaveRequest.employeeId && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    return leaveRequest;
  }

  @Get('balance/:employeeId')
  async getLeaveBalance(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Request() req,
    @Query('leaveTypeId') leaveTypeId: string,
    @Query('year') year: string,
  ): Promise<any> {
    // Staff can only view their own balance or managers can view any
    if (req.user.id !== employeeId && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const leaveTypeIdNum = parseInt(leaveTypeId);
    const yearNum = parseInt(year) || new Date().getFullYear();
    
    return this.leaveService.getLeaveBalance(employeeId, leaveTypeIdNum, yearNum);
  }

  @Get('balances/:employeeId')
  async getLeaveBalances(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Request() req,
    @Query('year') year: string,
  ): Promise<any[]> {
    // Staff can only view their own balances or managers can view any
    if (req.user.id !== employeeId && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const yearNum = parseInt(year) || new Date().getFullYear();
    
    return this.leaveService.getLeaveBalances(employeeId, yearNum);
  }

  @Get('types')
  @UseGuards(JwtAuthGuard) // Only require authentication, not permissions
  async getLeaveTypes(): Promise<LeaveType[]> {
    return this.leaveService.getLeaveTypes();
  }

  @Post('types')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async createLeaveType(@Body() leaveTypeData: Partial<LeaveType>): Promise<LeaveType> {
    return this.leaveService.createLeaveType(leaveTypeData);
  }

  @Put('types/:id')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async updateLeaveType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<LeaveType>,
  ): Promise<LeaveType> {
    return this.leaveService.updateLeaveType(id, updateData);
  }

  @Delete('types/:id')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async deleteLeaveType(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.leaveService.deleteLeaveType(id);
  }

  @Get('stats')
  async getLeaveStats(
    @Request() req,
    @Query('employeeId') employeeId?: string,
    @Query('year') year?: string,
  ): Promise<any> {
    // Staff can only view their own stats or managers can view any
    if (employeeId && req.user.id !== parseInt(employeeId) && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const employeeIdNum = employeeId ? parseInt(employeeId) : undefined;
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.leaveService.getLeaveStats(employeeIdNum, yearNum);
  }

  // Personal endpoints for staff
  @Get('my-requests')
  async getMyLeaveRequests(
    @Request() req,
    @Query('status') status?: LeaveStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<LeaveRequest[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.leaveService.getLeaveRequests(req.user.id, status, start, end);
  }

  @Get('my-balances')
  async getMyLeaveBalances(
    @Request() req,
    @Query('year') year: string,
  ): Promise<any[]> {
    const yearNum = parseInt(year) || new Date().getFullYear();
    
    return this.leaveService.getLeaveBalances(req.user.id, yearNum);
  }

  @Get('my-stats')
  async getMyLeaveStats(
    @Request() req,
    @Query('year') year: string,
  ): Promise<any> {
    const yearNum = year ? parseInt(year) : undefined;
    
    return this.leaveService.getLeaveStats(req.user.id, yearNum);
  }
} 