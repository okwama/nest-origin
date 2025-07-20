import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Phone number must contain only digits, spaces, hyphens, parentheses, and plus signs' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
  confirmPassword: string;
} 