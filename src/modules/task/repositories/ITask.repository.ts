import { Task } from "../entities/Task";
import { CreateTaskDTO, ListTasksQueryDTO, UpdateTaskDTO } from "../dtos/task.dto";

export interface ITaskRepository {
  create(data: CreateTaskDTO, userId: string): Promise<Task>;
  update(id: string, userId: string, data: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId: string): Promise<Task | null>;
  findAll(
    userId: string,
    filters: ListTasksQueryDTO
  ): Promise<{ tasks: Task[]; total: number }>;
}
