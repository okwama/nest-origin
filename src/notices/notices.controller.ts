import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hr/notices')
@UseGuards(JwtAuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  findAll() {
    return this.noticesService.findAll();
  }

  @Get('recent/list')
  findRecent(@Query('limit') limit: string = '10') {
    return this.noticesService.findRecent(parseInt(limit, 10));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: Partial<CreateNoticeDto>) {
    return this.noticesService.update(+id, updateNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticesService.remove(+id);
  }
} 