export declare enum StaffRole {
    STAFF = "staff",
    MANAGER = "manager",
    ADMIN = "admin"
}
export declare enum StaffStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class Staff {
    id: number;
    name: string;
    photoUrl: string;
    emplNo: string;
    idNo: string;
    role: string;
    phoneNumber: string;
    department: string;
    businessEmail: string;
    departmentEmail: string;
    salary: number;
    employmentType: string;
    createdAt: Date;
    updatedAt: Date;
    isActiveField: number;
    password: string;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    isActive(): boolean;
    get email(): string;
    get phone(): string;
    get status(): StaffStatus;
    get staffRole(): StaffRole;
}
