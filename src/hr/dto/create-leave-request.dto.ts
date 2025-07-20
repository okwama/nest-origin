import { IsNumber, IsDate, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveRequestDto {
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsNumber()
  leaveTypeId: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
} 