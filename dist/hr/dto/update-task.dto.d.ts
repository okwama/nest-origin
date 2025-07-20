import { CreateTaskDto } from './create-task.dto';
import { TaskPriority, TaskStatus } from '../entities/task.entity';
declare const UpdateTaskDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
    priority?: TaskPriority;
    status?: TaskStatus;
    completedAt?: Date;
    isCompleted?: boolean;
}
export {};
