import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveRequestDto } from './create-leave-request.dto';
import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { LeaveStatus } from '../entities/leave-request.entity';

export class UpdateLeaveRequestDto extends PartialType(CreateLeaveRequestDto) {
  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

  @IsOptional()
  @IsNumber()
  approvedBy?: number;
} 