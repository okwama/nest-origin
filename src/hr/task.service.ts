import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
import { StaffService } from '../users/staff.service';

export interface CreateTaskDto {
  title: string;
  description: string;
  salesRepId: number;
  priority?: TaskPriority;
  assignedById?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  completedAt?: Date;
  isCompleted?: boolean;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private staffService: StaffService,
  ) {}

  async createTask(createDto: CreateTaskDto): Promise<Task> {
    const { salesRepId, assignedById, ...taskData } = createDto;

    // Verify assigned staff exists
    const assignedStaff = await this.staffService.findOne(salesRepId);
    if (!assignedStaff) {
      throw new NotFoundException('Assigned staff not found');
    }

    // Verify assigner exists if provided
    if (assignedById) {
      const assigner = await this.staffService.findOne(assignedById);
      if (!assigner) {
        throw new NotFoundException('Assigner not found');
      }
    }

    const task = this.taskRepository.create({
      ...taskData,
      salesRepId,
      assignedById,
      priority: taskData.priority || TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      isCompleted: false,
    });

    return this.taskRepository.save(task);
  }

  async updateTask(id: number, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // If marking as completed, set completedAt
    if (updateDto.isCompleted && !task.isCompleted) {
      updateDto.completedAt = new Date();
      updateDto.status = TaskStatus.COMPLETED;
    }

    // If unmarking as completed, clear completedAt
    if (updateDto.isCompleted === false && task.isCompleted) {
      updateDto.completedAt = null;
      updateDto.status = TaskStatus.PENDING;
    }

    Object.assign(task, updateDto);
    return this.taskRepository.save(task);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'assignedBy'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async getTasksByStaff(salesRepId: number, status?: TaskStatus): Promise<Task[]> {
    const whereCondition: any = { salesRepId };

    if (status) {
      whereCondition.status = status;
    }

    return this.taskRepository.find({
      where: whereCondition,
      relations: ['assignedTo', 'assignedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTasksAssignedBy(assignedById: number, status?: TaskStatus): Promise<Task[]> {
    const whereCondition: any = { assignedById };

    if (status) {
      whereCondition.status = status;
    }

    return this.taskRepository.find({
      where: whereCondition,
      relations: ['assignedTo', 'assignedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllTasks(
    status?: TaskStatus,
    priority?: TaskPriority,
    salesRepId?: number,
    assignedById?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (salesRepId) {
      queryBuilder.andWhere('task.salesRepId = :salesRepId', { salesRepId });
    }

    if (assignedById) {
      queryBuilder.andWhere('task.assignedById = :assignedById', { assignedById });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('task.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return queryBuilder
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.assignedBy', 'assignedBy')
      .orderBy('task.createdAt', 'DESC')
      .getMany();
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.isCompleted) {
      throw new BadRequestException('Task is already completed');
    }

    task.isCompleted = true;
    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date();

    return this.taskRepository.save(task);
  }

  async cancelTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed task');
    }

    task.status = TaskStatus.CANCELLED;

    return this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async getTaskStats(salesRepId?: number, assignedById?: number): Promise<any> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (salesRepId) {
      queryBuilder.andWhere('task.salesRepId = :salesRepId', { salesRepId });
    }

    if (assignedById) {
      queryBuilder.andWhere('task.assignedById = :assignedById', { assignedById });
    }

    const [total, pending, completed, cancelled, overdue] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TaskStatus.PENDING }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TaskStatus.COMPLETED }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TaskStatus.CANCELLED }).getCount(),
      queryBuilder.clone().andWhere('task.dueDate < :now AND task.status != :completed', { 
        now: new Date(), 
        completed: TaskStatus.COMPLETED 
      }).getCount(),
    ]);

    return {
      total,
      pending,
      completed,
      cancelled,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  async getOverdueTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        dueDate: Between(new Date(0), new Date()),
        status: TaskStatus.PENDING,
      },
      relations: ['assignedTo', 'assignedBy'],
      order: { dueDate: 'ASC' },
    });
  }

  async getTasksDueToday(): Promise<Task[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return this.taskRepository.find({
      where: {
        dueDate: Between(startOfDay, endOfDay),
        status: TaskStatus.PENDING,
      },
      relations: ['assignedTo', 'assignedBy'],
      order: { priority: 'DESC', dueDate: 'ASC' },
    });
  }
} 