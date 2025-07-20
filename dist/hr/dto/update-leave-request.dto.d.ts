import { CreateLeaveRequestDto } from './create-leave-request.dto';
import { LeaveStatus } from '../entities/leave-request.entity';
declare const UpdateLeaveRequestDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLeaveRequestDto>>;
export declare class UpdateLeaveRequestDto extends UpdateLeaveRequestDto_base {
    status?: LeaveStatus;
    approvedBy?: number;
}
export {};
