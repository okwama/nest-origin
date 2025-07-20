import { Staff } from '../../users/entities/staff.entity';
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    completedAt: Date;
    isCompleted: boolean;
    priority: TaskPriority;
    status: TaskStatus;
    salesRepId: number;
    assignedById: number;
    dueDate: Date;
    assignedTo: Staff;
    assignedBy: Staff;
}
