import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { AllowedIpService } from './allowed-ip.service';
import { AllowedIpController } from './allowed-ip.controller';
import { UserDeviceService } from './user-device.service';
import { UserDeviceController } from './user-device.controller';
import { OutOfOffice } from './entities/out-of-office.entity';
import { OutOfOfficeService } from './out-of-office.service';
import { OutOfOfficeController } from './out-of-office.controller';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
// Entities
import { Attendance } from './entities/attendance.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveType } from './entities/leave-type.entity';
import { Task } from './entities/task.entity';
import { AllowedIp } from './entities/allowed-ip.entity';
import { UserDevice } from './entities/user-device.entity';
// Import Notice from notices module
import { Notice } from '../notices/entities/notice.entity';
// Import StaffService from users module
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
      LeaveRequest,
      LeaveBalance,
      LeaveType,
      Task,
      Notice,
      AllowedIp,
      UserDevice,
      OutOfOffice,
    ]),
    UsersModule, // Import UsersModule to access StaffService
  ],
  controllers: [
    AttendanceController,
    LeaveController,
    TaskController,
    NoticeController,
    PayrollController,
    AllowedIpController,
    UserDeviceController,
    OutOfOfficeController,
    ActivityController,
  ],
  providers: [
    AttendanceService,
    LeaveService,
    TaskService,
    NoticeService,
    PayrollService,
    AllowedIpService,
    UserDeviceService,
    OutOfOfficeService,
    ActivityService,
  ],
  exports: [
    AttendanceService,
    LeaveService,
    TaskService,
    NoticeService,
    PayrollService,
    AllowedIpService,
    UserDeviceService,
    OutOfOfficeService,
    ActivityService,
  ],
})
export class HrModule {} 