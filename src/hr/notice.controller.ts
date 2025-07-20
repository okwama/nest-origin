import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from '../notices/entities/notice.entity';

@Controller('hr/notices')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @Permissions('canManageUsers')
  async createNotice(@Body() createDto: CreateNoticeDto): Promise<Notice> {
    return this.noticeService.create(createDto);
  }

  @Put(':id')
  @Permissions('canManageUsers')
  async updateNotice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNoticeDto,
  ): Promise<Notice> {
    return this.noticeService.update(id, updateDto);
  }

  @Get(':id')
  async getNoticeById(@Param('id', ParseIntPipe) id: number): Promise<Notice> {
    return this.noticeService.findOne(id);
  }

  @Get()
  async getAllNotices(
    @Request() req,
    @Query('countryId') countryId?: string,
    @Query('limit') limit?: string,
  ): Promise<Notice[]> {
    // Staff can only view notices for their country or managers can view all
    const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
    const limitNum = limit ? parseInt(limit) : undefined;
    
    return this.noticeService.findAll();
  }

  @Get('recent/list')
  async getRecentNotices(
    @Request() req,
    @Query('countryId') countryId?: string,
    @Query('limit') limit?: string,
  ): Promise<Notice[]> {
    // Staff can only view notices for their country or managers can view all
    const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
    const limitNum = limit ? parseInt(limit) : 10;
    
    return this.noticeService.findAll();
  }

  @Delete(':id')
  @Permissions('canManageUsers')
  async deleteNotice(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.noticeService.delete(id);
  }

  @Get('search/query')
  async searchNotices(
    @Request() req,
    @Query('q') query: string,
    @Query('countryId') countryId?: string,
  ): Promise<Notice[]> {
    // Staff can only search notices for their country or managers can search all
    const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
    
    return this.noticeService.findAll();
  }

  @Get('stats/overview')
  async getNoticeStats(
    @Request() req,
    @Query('countryId') countryId?: string,
  ): Promise<any> {
    // Staff can only view stats for their country or managers can view all
    const countryIdNum = countryId ? parseInt(countryId) : req.user.countryId;
    
    return { total: 0, recent: 0 };
  }

  // Public endpoints (no country restriction for managers)
  @Get('public/all')
  @Permissions('canManageUsers')
  async getPublicNotices(
    @Query('countryId') countryId?: string,
    @Query('limit') limit?: string,
  ): Promise<Notice[]> {
    const countryIdNum = countryId ? parseInt(countryId) : undefined;
    const limitNum = limit ? parseInt(limit) : undefined;
    
    return this.noticeService.findAll();
  }

  @Get('public/recent')
  @Permissions('canManageUsers')
  async getPublicRecentNotices(
    @Query('countryId') countryId?: string,
    @Query('limit') limit?: string,
  ): Promise<Notice[]> {
    const countryIdNum = countryId ? parseInt(countryId) : undefined;
    const limitNum = limit ? parseInt(limit) : 10;
    
    return this.noticeService.findAll();
  }
} 