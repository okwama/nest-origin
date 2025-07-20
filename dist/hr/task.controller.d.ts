import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    createTask(createDto: CreateTaskDto, req: any): Promise<Task>;
    updateTask(id: number, updateDto: UpdateTaskDto, req: any): Promise<Task>;
    getTaskById(id: number, req: any): Promise<Task>;
    getAllTasks(req: any, status?: TaskStatus, priority?: TaskPriority, salesRepId?: string, assignedById?: string, startDate?: string, endDate?: string): Promise<Task[]>;
    getTasksByStaff(salesRepId: number, req: any, status?: TaskStatus): Promise<Task[]>;
    getTasksAssignedBy(assignedById: number, req: any, status?: TaskStatus): Promise<Task[]>;
    completeTask(id: number, req: any): Promise<Task>;
    cancelTask(id: number, req: any): Promise<Task>;
    deleteTask(id: number): Promise<void>;
    getTaskStats(req: any, salesRepId?: string, assignedById?: string): Promise<any>;
    getOverdueTasks(): Promise<Task[]>;
    getTasksDueToday(req: any): Promise<Task[]>;
    getMyTasks(req: any, status?: TaskStatus): Promise<Task[]>;
    getMyAssignedTasks(req: any, status?: TaskStatus): Promise<Task[]>;
    getMyTaskStats(req: any): Promise<any>;
    getMyTasksDueToday(req: any): Promise<Task[]>;
}
