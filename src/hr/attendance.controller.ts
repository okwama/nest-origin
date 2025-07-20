





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
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Controller('hr/attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  async checkIn(@Body() checkInDto: CheckInDto, @Request() req): Promise<any> {
    // Staff can only check in for themselves
    if (req.user.id !== checkInDto.staffId && !req.user.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    // Add IP address from request if not provided
    if (!checkInDto.ipAddress || checkInDto.ipAddress === 'unknown') {
      checkInDto.ipAddress = req.ip || 
                            req.connection?.remoteAddress || 
                            req.headers['x-forwarded-for']?.split(',')[0] ||
                            req.headers['x-real-ip'] ||
                            'unknown';
    }
    
    // Perform check-in
    const result = await this.attendanceService.checkIn(checkInDto);
    
    // Return minimal success response
    return {
      success: true,
      message: 'Check-in successful',
      attendanceId: result.id
    };
  }

  @Post('check-out')
  @UseGuards(JwtAuthGuard)
  async checkOut(@Body() checkOutDto: CheckOutDto, @Request() req): Promise<any> {
    console.log('=== CHECK-OUT CONTROLLER START ===');
    console.log('Request body:', checkOutDto);
    console.log('User from JWT:', req.user);
    
    try {
      // Extract staffId from JWT token
      const staffId = req.user.id;
      console.log('Extracted staff ID:', staffId);
      
      // Create checkout data with staffId from JWT
      const checkoutData = {
        ...checkOutDto,
        staffId,
      };
      console.log('Checkout data with staff ID:', checkoutData);
      
      // Perform checkout
      console.log('Calling attendance service checkOut...');
      const result = await this.attendanceService.checkOut(checkoutData);
      console.log('Service result:', result);
      
      // Check if result is null before accessing properties
      if (!result) {
        console.error('Check-out failed - no attendance record found');
        throw new BadRequestException('Check-out failed - no attendance record found');
      }
      
      console.log('Check-out successful, returning response...');
      // Return minimal success response
      return {
        success: true,
        message: 'Check-out successful',
        attendanceId: result.id
      };
      
    } catch (error) {
      console.error('Error in checkOut controller:', error);
      console.error('Error stack:', error.stack);
      
      // Re-throw the error to be handled by global exception handler
      throw error;
    }
  }

  @Get('current/:staffId')
  async getCurrentAttendance(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Request() req,
  ): Promise<Attendance | null> {
    // Staff can only view their own attendance or managers can view any
    if (req.user.id !== staffId && !req.user.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    return this.attendanceService.getCurrentAttendance(staffId);
  }

  @Get('staff/:staffId')
  async getAttendanceByStaff(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Attendance[]> {
    // Staff can only view their own attendance or managers can view any
    if (req.user.id !== staffId && !req.user.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.attendanceService.getAttendanceByStaff(staffId, start, end);
  }

  @Get('date/:date')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async getAttendanceByDate(@Param('date') date: string): Promise<Attendance[]> {
    return this.attendanceService.getAttendanceByDate(new Date(date));
  }

  @Get('stats')
  async getAttendanceStats(
    @Request() req,
    @Query('staffId') staffId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    // Staff can only view their own stats or managers can view any
    if (staffId && req.user.id !== parseInt(staffId) && !req.user.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const staffIdNum = staffId ? parseInt(staffId) : undefined;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.attendanceService.getAttendanceStats(staffIdNum, start, end);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async updateAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Attendance>,
  ): Promise<Attendance> {
    return this.attendanceService.updateAttendance(id, updateData);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @Permissions('canManageUsers')
  async deleteAttendance(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attendanceService.deleteAttendance(id);
  }

  @Get('my-attendance')
  async getMyAttendance(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Attendance[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.attendanceService.getAttendanceByStaff(req.user.id, start, end);
  }

  @Get('my-current')
  @HttpCode(HttpStatus.OK)
  async getMyCurrentAttendance(@Request() req): Promise<Attendance | null> {
    const attendance = await this.attendanceService.getCurrentAttendance(req.user.id);
    
    // If no current attendance found, return null
    // NestJS will automatically handle this as a 404 response
    if (!attendance) {
      return null;
    }
    
    return attendance;
  }

  @Get('my-stats')
  async getMyAttendanceStats(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.attendanceService.getAttendanceStats(req.user.id, start, end);
  }
} 