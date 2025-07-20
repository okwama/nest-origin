import { Staff } from '../../users/entities/staff.entity';
export declare enum AttendanceStatus {
    PENDING = 0,
    CHECKED_IN = 1,
    CHECKED_OUT = 2
}
export declare enum AttendanceType {
    REGULAR = "regular",
    OVERTIME = "overtime",
    LEAVE = "leave"
}
export declare class Attendance {
    id: number;
    staffId: number;
    date: Date;
    checkInTime: Date;
    checkOutTime: Date;
    checkInLatitude: number;
    checkInLongitude: number;
    checkOutLatitude: number;
    checkOutLongitude: number;
    checkInLocation: string;
    checkOutLocation: string;
    checkInIp: string;
    checkOutIp: string;
    status: AttendanceStatus;
    type: AttendanceType;
    totalHours: number;
    overtimeHours: number;
    isLate: boolean;
    lateMinutes: number;
    deviceInfo: string;
    timezone: string;
    shiftStart: string;
    shiftEnd: string;
    isEarlyDeparture: boolean;
    earlyDepartureMinutes: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    staff: Staff;
}
