import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Staff])],
  controllers: [UsersController, StaffController],
  providers: [UsersService, StaffService],
  exports: [UsersService, StaffService],
})
export class UsersModule {} 