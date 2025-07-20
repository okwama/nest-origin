import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  status?: number;
} 