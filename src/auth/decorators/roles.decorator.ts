import { SetMetadata } from '@nestjs/common';
import { StaffRole } from '../../users/entities/staff.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: StaffRole[]) => SetMetadata(ROLES_KEY, roles); 