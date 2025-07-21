import { IsString } from 'class-validator';

export class CreateOutOfOfficeDto {
  @IsString()
  title: string;

  @IsString()
  reason: string;

  @IsString()
  date: string; // YYYY-MM-DD
} 