import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { OutOfOfficeService } from './out-of-office.service';
import { CreateOutOfOfficeDto } from './dto/create-out-of-office.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('out-of-office')
@UseGuards(JwtAuthGuard)
export class OutOfOfficeController {
  constructor(private readonly service: OutOfOfficeService) {}

  @Post('apply')
  async apply(@Body() dto: CreateOutOfOfficeDto, @Request() req) {
    console.log('DEBUG OutOfOfficeController.apply received dto:', dto);
    return this.service.create({ ...dto, staff_id: req.user.id });
  }

  @Get('my-requests')
  async myRequests(@Request() req) {
    return this.service.findByStaff(req.user.id);
  }
} 