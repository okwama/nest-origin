import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus, AttendanceType } from './entities/attendance.entity';
import { StaffService } from '../users/staff.service';
import { AllowedIpService } from './allowed-ip.service';
import { UserDeviceService } from './user-device.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import * as mysql from 'mysql2/promise';

@Injectable()
export class AttendanceService {
  private dbConnection: mysql.Connection | null = null;

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private staffService: StaffService,
    private allowedIpService: AllowedIpService,
    private userDeviceService: UserDeviceService,
  ) {}

  private async getDbConnection(): Promise<mysql.Connection> {
    try {
    if (!this.dbConnection) {
        console.log('Creating new database connection...');
        console.log('DB Host:', process.env.DB_HOST || '102.218.215.35');
        console.log('DB Port:', process.env.DB_PORT || 3306);
        console.log('DB User:', process.env.DB_USERNAME || 'citlogis_bryan');
        console.log('DB Database:', process.env.DB_DATABASE || 'citlogis_finance');
        
      this.dbConnection = await mysql.createConnection({
        host: process.env.DB_HOST || '102.218.215.35',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME || 'citlogis_bryan',
        password: process.env.DB_PASSWORD || '@bo9511221.qwerty',
        database: process.env.DB_DATABASE || 'citlogis_finance',
      });
        
        console.log('Database connection created successfully');
      }
      
      // Test the connection
      await this.dbConnection.ping();
      console.log('Database connection is alive');
      
    return this.dbConnection;
    } catch (error) {
      console.error('Database connection error:', error);
      console.error('Error stack:', error.stack);
      
      // Reset connection on error
      this.dbConnection = null;
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async checkIn(checkInDto: CheckInDto): Promise<Attendance> {
    const { staffId, ipAddress, deviceId, ...checkInData } = checkInDto;
    
    // Verify staff exists and is active
    const staff = await this.staffService.findOne(staffId);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Validate device if deviceId is provided (silent validation)
    if (deviceId) {
      try {
        await this.userDeviceService.validateDevice({
          userId: staffId,
          deviceId,
          ipAddress
        });
        console.log(`✅ Device validation passed for staff ${staffId}`);
      } catch (error) {
        console.log(`⚠️ Device validation failed for staff ${staffId} - proceeding anyway: ${error.message}`);
        // Continue with check-in even if device validation fails
      }
    }

    // Validate IP address if provided (silent validation)
    if (ipAddress) {
      console.log(`Validating IP address: "${ipAddress}"`);
      
      const isIpAllowed = await this.allowedIpService.isIpAllowed(ipAddress);
      console.log(`IP validation result: ${isIpAllowed}`);
      
      if (!isIpAllowed) {
        console.log(`⚠️ IP address ${ipAddress} not allowed for check-in - proceeding anyway`);
        // Continue with check-in even if IP not allowed
      }
    }

    try {
      const connection = await this.getDbConnection();
      
      // Call the stored procedure
      const [results] = await connection.execute(
        'CALL CheckInStaff(?, ?, ?, ?, ?, ?)',
        [
          staffId,
          ipAddress || 'unknown',
          checkInData.latitude || null,
          checkInData.longitude || null,
          checkInData.location || null,
          checkInData.deviceInfo || null
        ]
      );
      
      // Get the result from the procedure
      const result = Array.isArray(results) ? results[0] : results;
      const procedureResult = Array.isArray(result) ? result[0] : result as any;
      
      if (procedureResult.result === 'ERROR') {
        throw new BadRequestException(procedureResult.message);
      }
      
      // Get the updated attendance record
      return this.getCurrentAttendance(staffId);
      
    } catch (error) {
      console.error('Error calling CheckInStaff procedure:', error);
      
      // Fallback to TypeORM if procedure fails
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await this.attendanceRepository.findOne({
      where: { staffId, date: today }
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      throw new BadRequestException('Already checked in today');
    }

    const now = new Date();
    const checkInTime = new Date();
    
    // Determine if late (assuming 9 AM start time)
    const shiftStart = new Date(today);
    shiftStart.setHours(9, 0, 0, 0);
    
    const isLate = checkInTime > shiftStart;
    const lateMinutes = isLate ? Math.floor((checkInTime.getTime() - shiftStart.getTime()) / (1000 * 60)) : 0;

    let attendance: Attendance;

    if (existingAttendance) {
      // Update existing record
      attendance = existingAttendance;
      attendance.checkInTime = checkInTime;
      attendance.checkInLatitude = checkInData.latitude;
      attendance.checkInLongitude = checkInData.longitude;
      attendance.checkInLocation = checkInData.location;
      attendance.checkInIp = ipAddress;
      attendance.isLate = isLate;
      attendance.lateMinutes = lateMinutes;
      attendance.status = AttendanceStatus.CHECKED_IN;
      attendance.deviceInfo = checkInData.deviceInfo;
      attendance.timezone = checkInData.timezone || 'UTC';
      attendance.shiftStart = '09:00:00';
      attendance.shiftEnd = '17:00:00';
    } else {
      // Create new record
      attendance = this.attendanceRepository.create({
        staffId,
        date: today,
        checkInTime,
        checkInLatitude: checkInData.latitude,
        checkInLongitude: checkInData.longitude,
        checkInLocation: checkInData.location,
        checkInIp: ipAddress,
        isLate,
        lateMinutes,
        status: AttendanceStatus.CHECKED_IN,
        type: AttendanceType.REGULAR,
        deviceInfo: checkInData.deviceInfo,
        timezone: checkInData.timezone || 'UTC',
        shiftStart: '09:00:00',
        shiftEnd: '17:00:00',
      });
    }

    return this.attendanceRepository.save(attendance);
    }
  }

  async checkOut(checkOutDto: CheckOutDto & { staffId: number }): Promise<Attendance> {
    const { staffId, deviceId, ipAddress, ...checkOutData } = checkOutDto;
    
    console.log('=== CHECK-OUT PROCESS START ===');
    console.log('Staff ID:', staffId);
    console.log('Device ID:', deviceId);
    console.log('IP Address:', ipAddress);
    console.log('Check-out data:', checkOutData);
    
    // Validate IP address if provided (silent validation)
    if (ipAddress) {
      console.log(`Validating IP address for check-out: "${ipAddress}"`);
      
      const isIpAllowed = await this.allowedIpService.isIpAllowed(ipAddress);
      console.log(`IP validation result for check-out: ${isIpAllowed}`);
      
      if (!isIpAllowed) {
        console.log(`⚠️ IP address ${ipAddress} not allowed for check-out - proceeding anyway`);
        // Continue with check-out even if IP not allowed
      }
    }

    try {
      console.log('Getting database connection...');
      const connection = await this.getDbConnection();
      console.log('Database connection established');
      
      // Check if stored procedure exists
      console.log('Checking if CheckOutStaff procedure exists...');
      try {
        const [procedureCheck] = await connection.execute(
          'SHOW PROCEDURE STATUS WHERE Name = ? AND Db = ?',
          ['CheckOutStaff', process.env.DB_DATABASE || 'citlogis_finance']
        );
        console.log('Procedure check result:', procedureCheck);
        
        if (!Array.isArray(procedureCheck) || procedureCheck.length === 0) {
          console.error('CheckOutStaff procedure not found, using TypeORM fallback');
          throw new Error('Stored procedure not found');
        }
      } catch (error) {
        console.error('Error checking stored procedure:', error);
        throw new Error('Stored procedure check failed');
      }
      
      // Call the stored procedure
      console.log('Calling CheckOutStaff procedure...');
      const [results] = await connection.execute(
        'CALL CheckOutStaff(?, ?, ?, ?, ?)',
        [
          staffId,
          ipAddress || 'unknown',
          checkOutData.latitude || null,
          checkOutData.longitude || null,
          checkOutData.location || null
        ]
      );
      
      console.log('Procedure results:', results);
      
      // Get the result from the procedure
      const result = Array.isArray(results) ? results[0] : results;
      const procedureResult = Array.isArray(result) ? result[0] : result as any;
      
      console.log('Procedure result:', procedureResult);
      
      if (procedureResult.result === 'ERROR') {
        console.error('Procedure returned error:', procedureResult.message);
        throw new BadRequestException(procedureResult.message);
      }
      
      console.log('Procedure successful, getting updated attendance...');
      // Get the updated attendance record
      const updatedAttendance = await this.getCurrentAttendance(staffId);
      console.log('Updated attendance:', updatedAttendance);
      
      return updatedAttendance;
      
    } catch (error) {
      console.error('Error in checkOut method:', error);
      console.error('Error stack:', error.stack);
      
      // Fallback to TypeORM if procedure fails
      console.log('Falling back to TypeORM check-out...');
      
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceRepository.findOne({
      where: { staffId, date: today }
    });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out today');
    }

    const now = new Date();
    const checkOutTime = new Date();
    
    // Calculate total hours
    const checkInTime = attendance.checkInTime;
    const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    // Determine if early departure (assuming 5 PM end time)
    const shiftEnd = new Date(today);
    shiftEnd.setHours(17, 0, 0, 0);
    
    const isEarlyDeparture = checkOutTime < shiftEnd;
    const earlyDepartureMinutes = isEarlyDeparture ? Math.floor((shiftEnd.getTime() - checkOutTime.getTime()) / (1000 * 60)) : 0;
    
    // Calculate overtime (hours beyond 8 hours)
    const regularHours = 8;
    const overtimeHours = totalHours > regularHours ? totalHours - regularHours : 0;

    attendance.checkOutTime = checkOutTime;
    attendance.checkOutLatitude = checkOutData.latitude;
    attendance.checkOutLongitude = checkOutData.longitude;
    attendance.checkOutLocation = checkOutData.location;
    attendance.checkOutIp = ipAddress;
    attendance.totalHours = parseFloat(totalHours.toFixed(2));
    attendance.overtimeHours = parseFloat(overtimeHours.toFixed(2));
    attendance.isEarlyDeparture = isEarlyDeparture;
    attendance.earlyDepartureMinutes = earlyDepartureMinutes;
    attendance.status = AttendanceStatus.CHECKED_OUT;
    attendance.notes = checkOutData.notes;

      console.log('Saving attendance with TypeORM fallback...');
      const savedAttendance = await this.attendanceRepository.save(attendance);
      console.log('Attendance saved successfully:', savedAttendance);
      
      return savedAttendance;
    }
  }

  async getAttendanceByStaff(staffId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    try {
      const connection = await this.getDbConnection();
      
      // Use default date range if not provided (last 30 days)
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate || new Date();
      
      // Call the stored procedure
      const [results] = await connection.execute(
        'CALL GetStaffAttendance(?, ?, ?)',
        [staffId, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
      );
      
      // The procedure returns [dataArray, metadataObject]
      // We need to get the first element of the data array
      const dataArray = Array.isArray(results) ? results[0] : [];
      
      if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
        return [];
      }
      
      // Convert the raw results to Attendance entities
      const attendanceList: Attendance[] = [];
      
      for (const attendanceData of (dataArray as any[]) || []) {
        // Get staff information
        const staff = await this.staffService.findOne(staffId);
        
        const attendance = new Attendance();
        attendance.id = attendanceData.id;
        attendance.staffId = attendanceData.staff_id;
        attendance.date = new Date(attendanceData.date);
        attendance.checkInTime = attendanceData.checkin_time ? new Date(attendanceData.checkin_time) : null;
        attendance.checkOutTime = attendanceData.checkout_time ? new Date(attendanceData.checkout_time) : null;
        attendance.checkInIp = attendanceData.checkin_ip;
        attendance.checkOutIp = attendanceData.checkout_ip;
        attendance.status = attendanceData.status;
        attendance.type = attendanceData.type;
        attendance.totalHours = attendanceData.total_hours;
        attendance.overtimeHours = attendanceData.overtime_hours;
        attendance.isLate = attendanceData.is_late;
        attendance.lateMinutes = attendanceData.late_minutes;
        attendance.createdAt = new Date(attendanceData.created_at);
        attendance.updatedAt = new Date(attendanceData.updated_at);
        
        // Add staff relation
        if (staff) {
          attendance.staff = staff;
        }
        
        attendanceList.push(attendance);
      }
      
      return attendanceList;
      
    } catch (error) {
      console.error('Error calling GetStaffAttendance procedure:', error);
      // Fallback to TypeORM if procedure fails
    const whereCondition: any = { staffId };
    
    if (startDate && endDate) {
      whereCondition.date = Between(startDate, endDate);
    }

    return this.attendanceRepository.find({
      where: whereCondition,
      order: { date: 'DESC' },
      relations: ['staff'],
    });
    }
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return this.attendanceRepository.find({
      where: { date: targetDate },
      relations: ['staff'],
      order: { checkInTime: 'ASC' },
    });
  }

  async getAttendanceStats(staffId?: number, startDate?: Date, endDate?: Date): Promise<any> {
    const queryBuilder = this.attendanceRepository.createQueryBuilder('attendance');

    if (staffId) {
      queryBuilder.where('attendance.staffId = :staffId', { staffId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const stats = await queryBuilder
      .select([
        'COUNT(*) as totalDays',
        'SUM(CASE WHEN attendance.isLate = 1 THEN 1 ELSE 0 END) as lateDays',
        'SUM(CASE WHEN attendance.isEarlyDeparture = 1 THEN 1 ELSE 0 END) as earlyDepartureDays',
        'SUM(attendance.totalHours) as totalHours',
        'SUM(attendance.overtimeHours) as totalOvertimeHours',
        'AVG(attendance.totalHours) as averageHoursPerDay',
      ])
      .getRawOne();

    return {
      totalDays: parseInt(stats.totalDays) || 0,
      lateDays: parseInt(stats.lateDays) || 0,
      earlyDepartureDays: parseInt(stats.earlyDepartureDays) || 0,
      totalHours: parseFloat(stats.totalHours) || 0,
      totalOvertimeHours: parseFloat(stats.totalOvertimeHours) || 0,
      averageHoursPerDay: parseFloat(stats.averageHoursPerDay) || 0,
    };
  }

  async getCurrentAttendance(staffId: number): Promise<Attendance | null> {
    console.log('=== GET CURRENT ATTENDANCE START ===');
    console.log('Staff ID:', staffId);
    
    try {
      const connection = await this.getDbConnection();
      console.log('Database connection established for getCurrentAttendance');
      
      // Call the stored procedure
      console.log('Calling GetCurrentAttendanceStatus procedure...');
      const [results] = await connection.execute(
        'CALL GetCurrentAttendanceStatus(?)',
        [staffId]
      );
      
      console.log('GetCurrentAttendanceStatus results:', results);
      
      // The procedure returns [dataArray, metadataObject]
      // We need to get the first element of the data array
      const dataArray = Array.isArray(results) ? results[0] : [];
      console.log('Data array:', dataArray);
      
      if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
        console.log('No attendance data found, returning null');
        return null;
      }
      
      // Get the first (and should be only) attendance record
      const attendanceData = (dataArray as any[])[0] as any;
      console.log('Attendance data from procedure:', attendanceData);
      
      // Get staff information
      const staff = await this.staffService.findOne(staffId);
      console.log('Staff data:', staff);
      
      const attendance = new Attendance();
      attendance.id = attendanceData.id;
      attendance.staffId = attendanceData.staff_id;
      attendance.date = new Date(attendanceData.date);
      attendance.checkInTime = attendanceData.checkin_time ? new Date(attendanceData.checkin_time) : null;
      attendance.checkOutTime = attendanceData.checkout_time ? new Date(attendanceData.checkout_time) : null;
      attendance.checkInLatitude = attendanceData.checkin_latitude;
      attendance.checkInLongitude = attendanceData.checkin_longitude;
      attendance.checkOutLatitude = attendanceData.checkout_latitude;
      attendance.checkOutLongitude = attendanceData.checkout_longitude;
      attendance.checkInLocation = attendanceData.checkin_location;
      attendance.checkOutLocation = attendanceData.checkout_location;
      attendance.checkInIp = attendanceData.checkin_ip;
      attendance.checkOutIp = attendanceData.checkout_ip;
      attendance.status = attendanceData.status;
      attendance.type = attendanceData.type;
      attendance.totalHours = attendanceData.total_hours;
      attendance.overtimeHours = attendanceData.overtime_hours;
      attendance.isLate = attendanceData.is_late;
      attendance.lateMinutes = attendanceData.late_minutes;
      attendance.deviceInfo = attendanceData.device_info;
      attendance.timezone = attendanceData.timezone;
      attendance.shiftStart = attendanceData.shift_start;
      attendance.shiftEnd = attendanceData.shift_end;
      attendance.isEarlyDeparture = attendanceData.is_early_departure;
      attendance.earlyDepartureMinutes = attendanceData.early_departure_minutes;
      attendance.notes = attendanceData.notes;
      attendance.createdAt = new Date(attendanceData.created_at);
      attendance.updatedAt = new Date(attendanceData.updated_at);
      
      if (staff) {
        attendance.staff = staff;
      }
      
      console.log('Created attendance object:', attendance);
      return attendance;
      
    } catch (error) {
      console.error('Error calling GetCurrentAttendanceStatus procedure:', error);
      console.error('Error stack:', error.stack);
      console.log('Falling back to TypeORM query...');
      
      // Fallback to TypeORM query if stored procedure fails
      try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        console.log('Querying with TypeORM fallback...');
        console.log('Date range:', today, 'to', tomorrow);
        
        const fallbackResult = await this.attendanceRepository.findOne({
          where: {
            staffId: staffId,
            date: today,
          },
      relations: ['staff'],
          order: { createdAt: 'DESC' }
    });
        
        console.log('TypeORM fallback result:', fallbackResult);
        return fallbackResult;
        
      } catch (fallbackError) {
        console.error('TypeORM fallback also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async updateAttendance(id: number, updateData: Partial<Attendance>): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    Object.assign(attendance, updateData);
    return this.attendanceRepository.save(attendance);
  }

  async deleteAttendance(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Attendance record not found');
    }
  }

  async validateDeviceAndIp(staffId: number, deviceId: string, ipAddress: string): Promise<boolean> {
    try {
      // Check if device is approved for this staff (silent validation)
      const deviceApproved = await this.userDeviceService.isDeviceApproved(staffId, deviceId);
      if (!deviceApproved) {
        console.log(`⚠️ Device ${deviceId} not approved for staff ${staffId} - proceeding anyway`);
        return true; // Allow checkout even if device not approved
      }

      // Check if IP address is allowed (silent validation)
      const ipAllowed = await this.allowedIpService.isIpAllowed(ipAddress);
      if (!ipAllowed) {
        console.log(`⚠️ IP address ${ipAddress} not allowed for checkout - proceeding anyway`);
        return true; // Allow checkout even if IP not allowed
      }

      console.log(`✅ Device and IP validation passed for staff ${staffId}`);
      return true;
    } catch (error) {
      console.error('⚠️ Error validating device and IP - proceeding anyway:', error);
      return true; // Allow checkout even if validation fails
    }
  }
} 