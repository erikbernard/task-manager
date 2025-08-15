import { AppError } from "../../../shared/middlewares/error.handler"; 
import { ITaskRepository } from "../repositories/ITask.repository";
import { CreateTaskDTO, ListTasksQueryDTO, UpdateTaskDTO } from "../dtos/task.dto";

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async create(data: CreateTaskDTO, userId: string) {
    return this.taskRepository.create(data, userId);
  }

  async update(id: string, userId: string, data: UpdateTaskDTO) {
    const taskExists = await this.taskRepository.findById(id, userId);
    if (!taskExists) {
      throw new AppError("Tarefa não encontrada.", 404);
    }
    return this.taskRepository.update(id, userId, data);
  }

  async delete(id: string, userId: string) {
    const taskExists = await this.taskRepository.findById(id, userId);
    if (!taskExists) {
      throw new AppError("Tarefa não encontrada.", 404);
    }
    await this.taskRepository.delete(id, userId);
  }

  async findById(id: string, userId: string) {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new AppError("Tarefa não encontrada.", 404);
    }
    return task;
  }

  async findAll(userId: string, filters: ListTasksQueryDTO) {
    return this.taskRepository.findAll(userId, filters);
  }
}
