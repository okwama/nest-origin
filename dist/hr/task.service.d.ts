import { Repository } from 'typeorm';
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
export declare class TaskService {
    private taskRepository;
    private staffService;
    constructor(taskRepository: Repository<Task>, staffService: StaffService);
    createTask(createDto: CreateTaskDto): Promise<Task>;
    updateTask(id: number, updateDto: UpdateTaskDto): Promise<Task>;
    getTaskById(id: number): Promise<Task>;
    getTasksByStaff(salesRepId: number, status?: TaskStatus): Promise<Task[]>;
    getTasksAssignedBy(assignedById: number, status?: TaskStatus): Promise<Task[]>;
    getAllTasks(status?: TaskStatus, priority?: TaskPriority, salesRepId?: number, assignedById?: number, startDate?: Date, endDate?: Date): Promise<Task[]>;
    completeTask(id: number): Promise<Task>;
    cancelTask(id: number): Promise<Task>;
    deleteTask(id: number): Promise<void>;
    getTaskStats(salesRepId?: number, assignedById?: number): Promise<any>;
    getOverdueTasks(): Promise<Task[]>;
    getTasksDueToday(): Promise<Task[]>;
}
