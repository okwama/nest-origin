export declare class AttendanceResponseDto {
    id: number;
    staffId: number;
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    checkInLatitude: string | null;
    checkInLongitude: string | null;
    checkOutLatitude: string | null;
    checkOutLongitude: string | null;
    checkInLocation: string | null;
    checkOutLocation: string | null;
    checkInIp: string | null;
    checkOutIp: string | null;
    status: number;
    type: string;
    totalHours: number | null;
    overtimeHours: string;
    isLate: number;
    lateMinutes: number;
    deviceInfo: string | null;
    timezone: string;
    shiftStart: string;
    shiftEnd: string;
    isEarlyDeparture: number;
    earlyDepartureMinutes: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    staff?: {
        id: number;
        name: string;
        photoUrl: string;
        emplNo: string;
        idNo: string;
        role: string;
        phoneNumber: string;
        department: string | null;
        businessEmail: string | null;
        departmentEmail: string | null;
        salary: string;
        employmentType: string;
        createdAt: string;
        updatedAt: string;
        isActiveField: number;
    };
}
