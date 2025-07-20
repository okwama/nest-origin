import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStaffDto: CreateStaffDto, @Request() req) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  async findAll() {
    return this.staffService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.staffService.search(query);
  }

  @Get('stats')
  async getStats() {
    return this.staffService.getStaffStats();
  }

  @Get('managers')
  async getManagers() {
    return this.staffService.getManagers();
  }

  @Get('role/:role')
  async findByRole(@Param('role') role: string) {
    return this.staffService.findByRole(role);
  }

  @Get('department/:department')
  async findByDepartment(@Param('department') department: string) {
    return this.staffService.findByDepartment(department);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.staffService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @Request() req,
  ) {
    const targetId = Number(id);
    return this.staffService.update(targetId, updateStaffDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.staffService.remove(Number(id));
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Request() req) {
    return this.staffService.update(Number(id), { isActiveField: 1 });
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @Request() req) {
    return this.staffService.update(Number(id), { isActiveField: 0 });
  }

  // Profile endpoints
  @Get('profile/me')
  async getMyProfile(@Request() req) {
    console.log('Profile request - req.user:', req.user);
    const userId = Number(req.user.id);
    console.log('Profile request - userId:', userId);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.staffService.findOne(userId);
  }

  @Patch('profile/me')
  async updateMyProfile(
    @Body() updateStaffDto: UpdateStaffDto,
    @Request() req,
  ) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.staffService.update(userId, updateStaffDto);
  }

  @Post('profile/me/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: { currentPassword: string; newPassword: string },
    @Request() req,
  ) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.staffService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}

