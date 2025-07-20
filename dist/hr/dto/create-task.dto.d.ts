import { TaskPriority } from '../entities/task.entity';
export declare class CreateTaskDto {
    title: string;
    description: string;
    salesRepId: number;
    priority?: TaskPriority;
    assignedById?: number;
}
