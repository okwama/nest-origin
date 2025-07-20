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
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';

@Controller('hr/tasks')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createDto: CreateTaskDto, @Request() req): Promise<Task> {
    // Only managers can assign tasks to others
    if (createDto.salesRepId !== req.user.sub && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to assign tasks');
    }
    
    // Set the assigner if not provided
    if (!createDto.assignedById) {
      createDto.assignedById = req.user.sub;
    }
    
    return this.taskService.createTask(createDto);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTaskDto,
    @Request() req,
  ): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    
    // Staff can only update their own tasks or managers can update any
    if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to update this task');
    }
    
    return this.taskService.updateTask(id, updateDto);
  }

  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    
    // Staff can only view their own tasks or managers can view any
    if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to view this task');
    }
    
    return task;
  }

  @Get()
  async getAllTasks(
    @Request() req,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('salesRepId') salesRepId?: string,
    @Query('assignedById') assignedById?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Task[]> {
    // Staff can only view their own tasks or managers can view any
    if (salesRepId && req.user.sub !== parseInt(salesRepId) && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const salesRepIdNum = salesRepId ? parseInt(salesRepId) : undefined;
    const assignedByIdNum = assignedById ? parseInt(assignedById) : undefined;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.taskService.getAllTasks(status, priority, salesRepIdNum, assignedByIdNum, start, end);
  }

  @Get('staff/:salesRepId')
  async getTasksByStaff(
    @Param('salesRepId', ParseIntPipe) salesRepId: number,
    @Request() req,
    @Query('status') status?: TaskStatus,
  ): Promise<Task[]> {
    // Staff can only view their own tasks or managers can view any
    if (req.user.sub !== salesRepId && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    return this.taskService.getTasksByStaff(salesRepId, status);
  }

  @Get('assigned-by/:assignedById')
  async getTasksAssignedBy(
    @Param('assignedById', ParseIntPipe) assignedById: number,
    @Request() req,
    @Query('status') status?: TaskStatus,
  ): Promise<Task[]> {
    // Staff can only view tasks they assigned or managers can view any
    if (req.user.sub !== assignedById && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    return this.taskService.getTasksAssignedBy(assignedById, status);
  }

  @Put(':id/complete')
  async completeTask(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    
    // Staff can only complete their own tasks or managers can complete any
    if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to complete this task');
    }
    
    return this.taskService.completeTask(id);
  }

  @Put(':id/cancel')
  async cancelTask(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    
    // Staff can only cancel their own tasks or managers can cancel any
    if (task.salesRepId !== req.user.sub && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions to cancel this task');
    }
    
    return this.taskService.cancelTask(id);
  }

  @Delete(':id')
  @RequirePermissions('canManageUsers')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Get('stats/overview')
  async getTaskStats(
    @Request() req,
    @Query('salesRepId') salesRepId?: string,
    @Query('assignedById') assignedById?: string,
  ): Promise<any> {
    // Staff can only view their own stats or managers can view any
    if (salesRepId && req.user.sub !== parseInt(salesRepId) && !req.user.canManageUsers) {
      throw new Error('Insufficient permissions');
    }
    
    const salesRepIdNum = salesRepId ? parseInt(salesRepId) : undefined;
    const assignedByIdNum = assignedById ? parseInt(assignedById) : undefined;
    
    return this.taskService.getTaskStats(salesRepIdNum, assignedByIdNum);
  }

  @Get('overdue')
  @RequirePermissions('canManageUsers')
  async getOverdueTasks(): Promise<Task[]> {
    return this.taskService.getOverdueTasks();
  }

  @Get('due-today')
  async getTasksDueToday(@Request() req): Promise<Task[]> {
    // Staff can only see their own due tasks or managers can see all
    if (req.user.canManageUsers) {
      return this.taskService.getTasksDueToday();
    } else {
      const allTasks = await this.taskService.getTasksDueToday();
      return allTasks.filter(task => task.salesRepId === req.user.sub);
    }
  }

  // Personal endpoints for staff
  @Get('my-tasks')
  async getMyTasks(@Request() req, @Query('status') status?: TaskStatus): Promise<Task[]> {
    return this.taskService.getTasksByStaff(req.user.sub, status);
  }

  @Get('my-assigned')
  async getMyAssignedTasks(@Request() req, @Query('status') status?: TaskStatus): Promise<Task[]> {
    return this.taskService.getTasksAssignedBy(req.user.sub, status);
  }

  @Get('my-stats')
  async getMyTaskStats(@Request() req): Promise<any> {
    return this.taskService.getTaskStats(req.user.sub);
  }

  @Get('my-due-today')
  async getMyTasksDueToday(@Request() req): Promise<Task[]> {
    const allTasks = await this.taskService.getTasksDueToday();
    return allTasks.filter(task => task.salesRepId === req.user.sub);
  }
} 