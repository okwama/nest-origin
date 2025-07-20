"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = exports.AttendanceType = exports.AttendanceStatus = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../../users/entities/staff.entity");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus[AttendanceStatus["PENDING"] = 0] = "PENDING";
    AttendanceStatus[AttendanceStatus["CHECKED_IN"] = 1] = "CHECKED_IN";
    AttendanceStatus[AttendanceStatus["CHECKED_OUT"] = 2] = "CHECKED_OUT";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var AttendanceType;
(function (AttendanceType) {
    AttendanceType["REGULAR"] = "regular";
    AttendanceType["OVERTIME"] = "overtime";
    AttendanceType["LEAVE"] = "leave";
})(AttendanceType || (exports.AttendanceType = AttendanceType = {}));
let Attendance = class Attendance {
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id' }),
    __metadata("design:type", Number)
], Attendance.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkout_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOutTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkInLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkInLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkout_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkOutLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkout_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkOutLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_location', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkInLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkout_location', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkOutLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_ip', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkInIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkout_ip', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkOutIp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: AttendanceStatus.CHECKED_IN,
    }),
    __metadata("design:type", Number)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AttendanceType,
        default: AttendanceType.REGULAR,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_hours', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "totalHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Attendance.prototype, "overtimeHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_late', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "isLate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'late_minutes', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Attendance.prototype, "lateMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_info', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "deviceInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'timezone', type: 'varchar', length: 50, default: 'UTC' }),
    __metadata("design:type", String)
], Attendance.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shift_start', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "shiftStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shift_end', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "shiftEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_early_departure', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "isEarlyDeparture", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'early_departure_minutes', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Attendance.prototype, "earlyDepartureMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], Attendance.prototype, "staff", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendance'),
    (0, typeorm_1.Index)(['staffId', 'date'], { unique: true }),
    (0, typeorm_1.Index)(['staffId', 'checkInTime']),
    (0, typeorm_1.Index)(['staffId', 'checkOutTime']),
    (0, typeorm_1.Index)(['date', 'status'])
], Attendance);
//# sourceMappingURL=attendance.entity.js.map