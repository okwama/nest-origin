import { IsEmail, IsString, IsOptional, IsNumber, MinLength, IsInt } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @MinLength(2)
  emplNo: string;

  @IsString()
  @MinLength(2)
  idNo: string;

  @IsString()
  @MinLength(2)
  role: string;

  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @IsEmail()
  @IsOptional()
  departmentEmail?: string;

  @IsNumber()
  salary: number;

  @IsString()
  @MinLength(2)
  employmentType: string;

  @IsInt()
  @IsOptional()
  isActiveField?: number;
} 