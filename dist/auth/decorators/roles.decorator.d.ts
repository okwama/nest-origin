import { StaffRole } from '../../users/entities/staff.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: StaffRole[]) => import("@nestjs/common").CustomDecorator<string>;
