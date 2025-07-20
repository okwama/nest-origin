"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const leave_service_1 = require("./leave.service");
const leave_controller_1 = require("./leave.controller");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const notice_service_1 = require("./notice.service");
const notice_controller_1 = require("./notice.controller");
const payroll_service_1 = require("./payroll.service");
const payroll_controller_1 = require("./payroll.controller");
const allowed_ip_service_1 = require("./allowed-ip.service");
const allowed_ip_controller_1 = require("./allowed-ip.controller");
const user_device_service_1 = require("./user-device.service");
const user_device_controller_1 = require("./user-device.controller");
const attendance_entity_1 = require("./entities/attendance.entity");
const leave_request_entity_1 = require("./entities/leave-request.entity");
const leave_balance_entity_1 = require("./entities/leave-balance.entity");
const leave_type_entity_1 = require("./entities/leave-type.entity");
const task_entity_1 = require("./entities/task.entity");
const allowed_ip_entity_1 = require("./entities/allowed-ip.entity");
const user_device_entity_1 = require("./entities/user-device.entity");
const notice_entity_1 = require("../notices/entities/notice.entity");
const users_module_1 = require("../users/users.module");
let HrModule = class HrModule {
};
exports.HrModule = HrModule;
exports.HrModule = HrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                attendance_entity_1.Attendance,
                leave_request_entity_1.LeaveRequest,
                leave_balance_entity_1.LeaveBalance,
                leave_type_entity_1.LeaveType,
                task_entity_1.Task,
                notice_entity_1.Notice,
                allowed_ip_entity_1.AllowedIp,
                user_device_entity_1.UserDevice,
            ]),
            users_module_1.UsersModule,
        ],
        controllers: [
            attendance_controller_1.AttendanceController,
            leave_controller_1.LeaveController,
            task_controller_1.TaskController,
            notice_controller_1.NoticeController,
            payroll_controller_1.PayrollController,
            allowed_ip_controller_1.AllowedIpController,
            user_device_controller_1.UserDeviceController,
        ],
        providers: [
            attendance_service_1.AttendanceService,
            leave_service_1.LeaveService,
            task_service_1.TaskService,
            notice_service_1.NoticeService,
            payroll_service_1.PayrollService,
            allowed_ip_service_1.AllowedIpService,
            user_device_service_1.UserDeviceService,
        ],
        exports: [
            attendance_service_1.AttendanceService,
            leave_service_1.LeaveService,
            task_service_1.TaskService,
            notice_service_1.NoticeService,
            payroll_service_1.PayrollService,
            allowed_ip_service_1.AllowedIpService,
            user_device_service_1.UserDeviceService,
        ],
    })
], HrModule);
//# sourceMappingURL=hr.module.js.map