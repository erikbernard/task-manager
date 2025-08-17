import { TaskService } from './../../../src/modules/task/services/Task.service';
import { ITaskRepository } from './../../../src/modules/task/repositories/ITask.repository';
import { Task } from '../../../src/modules/task/entities/Task';
import { AppError } from '../../../src/shared/middlewares/error.handler';

const mockTaskRepository: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const taskService = new TaskService(mockTaskRepository);

const mockTask: Task = {
  id: "task1",
  title: "Test Task",
  description: "A description",
  priority: "MEDIUM",
  status: "NOSTARTED",
  user_id: "user1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("TaskService", () => {
  describe("create", () => {
    it("deve criar uma nova tarefa com sucesso", async () => {
      const taskData = {
        title: "New Task",
        description: "Desc...",
        priority: "HIGH" as const,
      };
      const userId = "user1";

      mockTaskRepository.create.mockResolvedValue({ ...mockTask, ...taskData });

      const task = await taskService.create(taskData, userId);

      expect(task).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData, userId);
    });
  });

  describe("update", () => {
    it("deve atualizar uma tarefa existente", async () => {
      const taskId = "task1";
      const userId = "user1";
      const updateData = {
        title: "New Task",
        description: "Desc...",
        priority: "HIGH" as const,
        status: "COMPLETED" as const,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue({
        ...mockTask,
        ...updateData,
      });

      const updatedTask = await taskService.update(taskId, userId, updateData);

      expect(updatedTask).toBeDefined();
      expect(updatedTask?.status).toBe("COMPLETED");
      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        taskId,
        userId,
        updateData
      );
    });

    it("deve lançar um erro ao tentar atualizar uma tarefa que não existe", async () => {
      const taskId = "non_existent_task";
      const userId = "user1";
      const updateData = {
        title: "New Task",
        description: "Desc...",
        priority: "HIGH" as const,
        status: "COMPLETED" as const,
      };

      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(
        taskService.update(taskId, userId, updateData)
      ).rejects.toThrow(new AppError("Tarefa não encontrada.", 404));
    });
  });

  describe("delete", () => {
    it("deve deletar uma tarefa existente", async () => {
      const taskId = "task1";
      const userId = "user1";

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await expect(taskService.delete(taskId, userId)).resolves.not.toThrow();
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId, userId);
    });

    it("deve lançar um erro ao tentar deletar uma tarefa que não existe", async () => {
      const taskId = "non_existent_task";
      const userId = "user1";

      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(taskService.delete(taskId, userId)).rejects.toThrow(
        new AppError("Tarefa não encontrada.", 404)
      );
    });
  });
});
